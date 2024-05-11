const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('/home/t24123/src/v0.5src/web/backend/utils/jwt-util');
const redisClient = require('/home/t24123/src/v0.5src/web/backend/utils/redis')

// 로그인
router.get('/login', async (req, res) => {  // 경로 수정
    const query = 'SELECT * FROM `user` WHERE kakao_id = ?';
    const query2 = 'INSERT INTO `user` (kakao_id, name, email) VALUES (?, ?, ?)';
    const kakao_token = req.headers["authorization"];
    
    // 사용자 정보 가져오기
    try{
        userinfo = await axios({    // kakao 서버에서 사용자 정보 가져와 userinfo에 저장
            method:'get',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${kakao_token}`
            }
        });
    } catch(err) {
        console.error(err);
    }

    console.log(userinfo.data.id);
    // 전달 형식 참고: https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#req-user-info
    let kakao_id = userinfo.data.id;
    kakao_id = kakao_id.toString();
    const user_name = userinfo.data.properties.nickname;
    //const user_pic = userinfo.data.properties.profile_image;
    const user_email = userinfo.data.kakao_account.email;

    const values = [kakao_id, user_name, user_email];

    console.log(typeof kakao_id);

    req.conn.query(query, kakao_id, (err, results) => { // user 테이블에 회원 정보가 존재하는지 확인
        if (err) {
            console.error(err);
            res.status(500).json({
                result_req: err.message
            });
            return;
        }

        console.log(results.length);

        if(results.length === 0){   // 계정 정보가 없으면 회원가입 처리
            req.conn.query(query2, values, (err, results2) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        result_req: "회원가입 실패" + err.message
                    });
                    return;
                }

                console.log("회원가입 성공");

            });
        }

        req.conn.query(query, kakao_id, (err, results3) => { // user 테이블에 회원 정보가 존재하는지 확인
            if (err) {
                console.error(err);
                res.status(500).json({
                    result_req: err.message
                });
                return;
            }
    
            console.log(results3[0]);
    
            const access_token = jwt.sign(results3[0].user_id);
            const refresh_token = jwt.refresh();
    
            redisClient.set(results3[0].user_id, refresh_token);
    
            // user_id, createdAt, access_token, refresh_token 전달
            res.status(200).send({
                user_id: results3[0].user_id,
                createdAt: results3[0].createdAt,
                access_token: access_token,
                refresh_token: refresh_token
            });
        });
    });
    
});

// 로그아웃
router.get('/logout', async (req, res) => {
    const access_token = req.body.access_token; // 형식 확인 후 수정

    try{
        console.log(access_token);
        logout_result = await axios({    // 로그아웃 처리(성공 시 아이디 반환됨)
            method:'post',
            url:'https://kapi.kakao.com/v1/user/logout',
            headers:{
                Authorization: `Bearer ${access_token}`
            }
        });
    } catch(err) {
        console.error(err);
    }

});

module.exports = router;
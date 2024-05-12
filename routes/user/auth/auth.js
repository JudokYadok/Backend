const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('../../../utils/jwt.js');

// 카카오 서버에서 사용자 정보 가져오기
const getKaKaoUserdata = async (kakao_token) => {
    try{
        const userdata = await axios({    // kakao 서버에서 사용자 정보 가져와 userinfo에 저장
            method:'get',
            url:'https://kapi.kakao.com/v2/user/me',
            headers:{
                Authorization: `Bearer ${kakao_token}`
            }
        });
        return userdata.data;
    } catch(err) {
        console.error(err);
    }
};

// DB에서 사용자 정보 가져오기
const getUserdata = async (req, res, kakao_id) => {
    const query = 'SELECT * FROM `user` WHERE kakao_id = ?';
    return new Promise((resolve, reject) => {
        req.conn.query(query, kakao_id, (err, results) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// 회원가입 처리
const signUp = async (req, res, values) => {
    const query = 'INSERT INTO `user` (kakao_id, name, email) VALUES (?, ?, ?)';
    return new Promise((resolve, reject) => {
        req.conn.query(query, values, (err, results) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// 토큰 생성
const sendData = async (res, userdata) => {
    const access_token = jwt.sign(userdata.user_id);
    const refresh_token = jwt.refresh();

    // user_id, createdAt, access_token, refresh_token 전달
    res.status(200).send({
        user_id: userdata.user_id,
        createdAt: userdata.createdAt,
        access_token: access_token,
        refresh_token: refresh_token
    });
};

// 로그인
const login = async (req, res) => {
    const kakao_token = req.headers["authorization"];
    console.log(kakao_token);

    try {
        const kakao_data = await getKaKaoUserdata(kakao_token);
        const kakao_id = kakao_data.id.toString();
        const user_name = kakao_data.properties.nickname;
        const user_email = kakao_data.kakao_account.email;
        const values = [kakao_id, user_name, user_email];

        let user_data = await getUserdata(req, res, kakao_id);

        if (user_data.length === 0) {
            // 계정 정보가 없으면 회원가입 처리
            await signUp(req, res, values);
            user_data = await getUserdata(req, res, kakao_id)
        }

        await sendData(res, user_data[0]);
    } catch (err) {
        res.status(500).json({
            result_req: err.message
        });
    }
};

router.get('/login', login);

// 로그아웃
router.get('/logout', async (req, res) => {
    
});

module.exports = router;
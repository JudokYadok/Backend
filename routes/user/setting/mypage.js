const express = require("express");
const router = express.Router();

// 마이 페이지 조회
const viewMyPage = (req, res) => {
    const { user_id } = req.params; // URL 파라미터에서 user_id 추출
  
    const query = `
        SELECT *
        FROM user
        WHERE user_id = ?;
    `;
    const values = [user_id];
  
    req.conn.query(query, values, (err, userdata) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch user info' });
            return;
        }
  
        if (userdata.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(userdata[0]); // 조회된 지문을 JSON 형태로 응답
        }
    });
  };

const updateMyPage = (req, res) => {
    const { name, email, d_day, user_id } = req.body;
  
    const query = `
        UPDATE user
        SET name = ?, email = ?, d_day = ?
        WHERE user_id = ?;
    `;
    const values = [name, email, d_day, user_id];
  
    req.conn.query(query, values, (err, userdata) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch user info' });
            return;
        }
  
        res.status(200).json({ result_req: '회원 정보 수정 성공'})
    });
  };

const deleteUser = (req, res) => {
    const { user_id } = req.params; // URL 파라미터에서 user_id 추출
  
    const query = `
        DELETE
        FROM user
        WHERE user_id = ?;
    `;
    const values = [user_id];
  
    req.conn.query(query, values, (err, userdata) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch user info' });
            return;
        }
  
        res.status(200).json({ result_req: '회원 탈퇴 성공'});
    });
  }

router.get('/:user_id', viewMyPage);

router.put('', updateMyPage);

router.delete('/:user_id', deleteUser);

module.exports = router;
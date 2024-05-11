const express = require("express");
const router = express.Router();

// 추가한 사용자 지문 조회
const viewMyPage = (req, res) => {
    const { text_id } = req.params; // URL 파라미터에서 text_id 추출
  
    const query = `
        SELECT user_id, email, name
        FROM user
        WHERE user_id = ?;
    `;
    const values = [user_id];
  
    req.conn.query(query, values, (err, MyText) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Failed to fetch user info' });
            return;
        }
  
        if (MyText.length === 0) {
            res.status(404).json({ error: 'User not found' }); // 해당 text_id에 해당하는 Mytext가 없는 경우
        } else {
            res.json(MyText[0]); // 조회된 지문을 JSON 형태로 응답
        }
    });
  };
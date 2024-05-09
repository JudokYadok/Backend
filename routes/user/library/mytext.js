const text = require('/home/t24123/models')
const express = require("express");
const router = express.Router();

// 추가한 사용자 지문 목록 조회
const viewMytextList = (req, res) => {
  
    text.findAll({
        attributes: ['category', 'title', 'year'],
        where: {
            // user_id: user_id, // 해당 사용자 지문만 검색
      }
    })
    .then(MyTexts => {
      res.json(MyTexts); // 조회된 지문 리스트를 JSON 형태로 응답
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch user texts' }); // 오류 발생 시 500 에러 응답
    });
};

router.get("/user/library/Mytext", viewMytextList);

module.exports = router;
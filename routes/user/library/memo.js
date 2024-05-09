const { Text, Memo } = require('./models')
const express = require("express");
const router = express.Router();

// 메모 목록 조회
const viewMemoList = (req, res) => {
    Memo.findAll({
      attributes: ['updatedAt'], // updatedAt 필드만 선택
      include: [{
        model: Text, // Text 모델과 조인
        attributes: ['title'], // title 필드만 가져오도록 설정
        where: {
          id: Sequelize.col('Memo.text_id') // Memo와 Text 테이블을 조인할 때, Memo.text_id와 Text.id가 일치하도록 설정
        }
      }]
    })
    .then(memos => {
      const memoList = memos.map(memo => ({
        title: memo.Text.title,
        updatedAt: memo.updatedAt
      }));
      res.json(memoList); // 조회된 메모 리스트를 JSON 형태로 응답
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch memo list' }); // 오류 발생 시 500 에러 응답
    });
};

router.get("/user/library/memo", viewMemoList);

module.exports = router;
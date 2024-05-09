const text = require('/home/t24123/models')
const express = require("express");
const router = express.Router();

const app = express();

// 기출 지문 유형 선택 화면 조회
const selectPrevtextCategory = (req, res) => {
    text.findAll({
        attributes: ['category'], // category 필드만 선택
        where: {
            user_id: 1 // 관리자 지문만 검색
    },
        group: ['category'] // 중복을 제거하기 위해 그룹화
    })
    .then(categories => {
      const categoryList = categories.map(category => category.category);
      res.json(categoryList); // 카테고리 리스트를 JSON 형태로 응답
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch previous categories from database' }); // 오류 발생 시 500 에러 응답
    });
};

router.get("/user/study/prevtext", selectPrevtextCategory);

module.exports = router;
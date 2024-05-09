const text = require('./models')
const express = require("express");
const router = express.Router();

const app = express();


// 사용자 지문 유형 선택 화면 조회
const selectMytextCategory = (req, res) => {
    text.findAll({
        attributes: ['category'], // category 필드만 선택
    //     where: {
    //         user_id: user_id // 해당 사용자 지문만 검색
    // },
        group: ['category'] // 중복을 제거하기 위해 그룹화
    })
    .then(categories => {
      const categoryList = categories.map(category => category.category);
      res.json(categoryList); // 카테고리 리스트를 JSON 형태로 응답
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch user categories from database' }); // 오류 발생 시 500 에러 응답
    });
};

// 사용자 지문 선택 화면 조회
const selectMyText = (req, res) => {
    const category = req.params.category; // URL 파라미터에서 category 추출
  
    text.findAll({
        attributes: ['title', 'year'],
        where: {
            // user_id: user_id, // 해당 사용자 지문만 검색
            category: category // 주어진 category에 해당하는 행만 검색
      }
    })
    .then(MyTexts => {
      res.json(MyTexts); // 조회된 지문 리스트를 JSON 형태로 응답
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch user texts' }); // 오류 발생 시 500 에러 응답
    });
};

router.get("/user/study/Mytext", selectMytextCategory);
router.get("/user/study/Mytext/:category", selectMyText);
module.exports = router;
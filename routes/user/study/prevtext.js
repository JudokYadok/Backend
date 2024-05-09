const text = require('/home/t24123/models')
const express = require("express");
const router = express.Router();

const app = express();

// 기출 지문 유형 선택 화면 조회
const selectPrevtextCategory = (req, res) => {
    text.findAll({
        attributes: ['category'], // category 필드만 선택
        where: {
            user_id: 0 // 관리자 지문만 검색
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

// 기출 지문 선택 화면 조회
const selectPrevText = (req, res) => {
    const category = req.params.category; // URL 파라미터에서 category 추출
  
    text.findAll({
        attributes: ['title', 'year'],
        where: {
            user_id: 0, // 관리자 지문만 검색
            category: category // 주어진 category에 해당하는 행만 검색
      }
    })
    .then(prevTexts => {
      res.json(prevTexts); // 조회된 지문 리스트를 JSON 형태로 응답
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch previous texts' }); // 오류 발생 시 500 에러 응답
    });
};

// 기출 지문 조회
const viewPrevText = (req, res) => {
    const { category, text_id } = req.params.category; // URL 파라미터에서 category, text_id 추출
  
    text.findOne({
        attributes: ['title', 'year', 'contents'],
        where: {
            user_id: 0, // 관리자 지문만 검색
            category: category, // 주어진 category에 해당하는 행만 검색
            text_id: text_id
      }
    })
    .then(prevText => {
        if (prevText) {
            res.json(prevText); // 조회된 지문을 JSON 형태로 응답
        } else {
            res.status(404).json({ error: 'Prevtext not found' }); // 해당 text_id에 해당하는 Prevtext가 없는 경우
        }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch previous texts' }); // 오류 발생 시 500 에러 응답
    });
};

router.get("/user/study/prevtext", selectPrevtextCategory);
router.get("/user/study/prevtext/:category", selectPrevText);
router.get("/user/study/prevtext/:category/:text_id", viewPrevText);

module.exports = router;
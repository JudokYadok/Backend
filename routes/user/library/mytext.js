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

// 추가한 사용자 지문 조회
const viewMytext = (req, res) => {
    const { text_id } = req.params; // URL 파라미터에서 text_id 추출
  
    text.findOne({
        attributes: ['title', 'year', 'contents'],
        where: {
            // user_id: user_id, // 해당 사용자 지문만 검색
            text_id: text_id
      }
    })
    .then(MyText => {
        if (MyText) {
            res.json(MyText); // 조회된 지문을 JSON 형태로 응답
        } else {
            res.status(404).json({ error: 'Usertext not found' }); // 해당 text_id에 해당하는 Mytext가 없는 경우
        }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch user texts' }); // 오류 발생 시 500 에러 응답
    });
};

// 사용자 지문 추가
const addMytext = (req, res) => {
    const { category, title, contents } = req.body; // 요청에서 JSON 데이터 추출
    const user_id = user_id; // 사용자 ID
  
    Text.create({
      user_id: user_id, // 현재 로그인한 사용자의 ID
      category: category, // 요청에서 받은 category 값
      title: title, // 요청에서 받은 title 값
      contents: contents // 요청에서 받은 contents 값
    })
    .then(text => {
      res.json(text); // 추가된 텍스트 정보를 JSON 형태로 응답
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to add text to the library' }); // 오류 발생 시 500 에러 응답
    });
};

// 사용자 지문 수정
const modifyMytext = (req, res) => {
    const { text_id } = req.params; // URL 파라미터에서 text_id 추출
    const { category, title, contents } = req.body; // 요청에서 JSON 데이터 추출
  
    Text.update({
      category: category, // 요청에서 받은 category 값
      title: title, // 요청에서 받은 title 값
      contents: contents // 요청에서 받은 contents 값
    }, {
      where: {
        text_id: text_id // 주어진 text_id에 해당하는 행만 업데이트
      }
    })
    .then(result => {
      if (result[0] !== 0) {
        res.json({ message: 'Text modified successfully' }); // 수정 성공 메시지 응답
      } else {
        res.status(404).json({ error: 'Text not found' }); // 해당 text_id에 해당하는 텍스트가 없는 경우 404 에러 응답
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to modify text' }); // 오류 발생 시 500 에러 응답
    });
};

router.get("/user/library/Mytext", viewMytextList);
router.get("/user/library/Mytext/:text_id", viewMytext);
router.post("/user/library/Mytext", addMytext);
router.put("/user/library/Mytext", modifyMytext);

module.exports = router;
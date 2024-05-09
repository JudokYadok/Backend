const { Text, Memo } = require('/home/t24123/models')
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

// 메모 조회
const viewMemo = (req, res) => {
    const { memo_id } = req.params; // URL 파라미터에서 text_id 추출
  
    Memo.findOne({
        attributes: ['title', 'contents'],
        where: {
            // user_id: user_id, // 해당 사용자 메모만 검색
            memo_id: memo_id
      }
    })
    .then(MyMemo => {
        if (MyMemo) {
            res.json(MyMemo); // 조회된 메모를 JSON 형태로 응답
        } else {
            res.status(404).json({ error: 'Memo not found' }); // 해당 memo_id에 해당하는 Memo가 없는 경우
        }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to fetch memo' }); // 오류 발생 시 500 에러 응답
    });
};

// 메모 수정
const modifyMemo = (req, res) => {
    const { memo_id } = req.params; // URL 파라미터에서 memo_id 추출
    const { contents } = req.body; // 요청에서 JSON 데이터 추출
  
    Memo.update({
      contents: contents // 요청에서 받은 contents 값
    }, {
      where: {
        memo_id: memo_id // 주어진 memo_id에 해당하는 행만 업데이트
      }
    })
    .then(result => {
      if (result[0] !== 0) {
        res.json({ message: 'Memo modified successfully' }); // 수정 성공 메시지 응답
      } else {
        res.status(404).json({ error: 'Memo not found' }); // 해당 memo_id에 해당하는 텍스트가 없는 경우 404 에러 응답
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to modify memo' }); // 오류 발생 시 500 에러 응답
    });
};

// 메모 삭제
const deleteMemo = (req, res) => {
    const { memo_id } = req.params; // URL 파라미터에서 memo_id 추출
  
    Memo.destroy({
      where: {
        memo_id: memo_id // 주어진 memo_id에 해당하는 행 삭제
      }
    })
    .then(result => {
      if (result !== 0) {
        res.json({ message: 'Memo deleted successfully' }); // 삭제 성공 메시지 응답
      } else {
        res.status(404).json({ error: 'Memo not found' }); // 해당 memo_id에 해당하는 텍스트가 없는 경우 404 에러 응답
      }
    })
    .catch(error => {
      res.status(500).json({ error: 'Failed to delete memo' }); // 오류 발생 시 500 에러 응답
    });
};

router.get("/user/library/memo", viewMemoList);
router.put("/user/library/memo", modifyMemo);
router.delete("/user/library/memo", deleteMemo);

module.exports = router;
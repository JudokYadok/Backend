const { Text, Memo } = require('/home/t24123/models')
const express = require("express");
const router = express.Router();

// 메모 목록 조회
const viewMemoList = (req, res) => {
  const query = `
      SELECT memos.updatedAt, texts.title
      FROM memos
      INNER JOIN texts ON memos.text_id = texts.text_id;
  `;

  req.conn.query(query, (err, memos) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to fetch memo list' });
          return;
      }

      const memoList = memos.map(memo => ({
          title: memo.title,
          updatedAt: memo.updatedAt
      }));
      res.json(memoList); // 조회된 메모 리스트를 JSON 형태로 응답
  });
};

// 메모 조회
const viewMemo = (req, res) => {
  const { memo_id } = req.params; // URL 파라미터에서 memo_id 추출

  const query = `
      SELECT title, contents
      FROM memos
      WHERE memo_id = ?;
  `;
  const values = [memo_id];

  req.conn.query(query, values, (err, memo) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to fetch memo' });
          return;
      }

      if (memo.length === 0) {
          res.status(404).json({ error: 'Memo not found' }); // 해당 memo_id에 해당하는 Memo가 없는 경우
      } else {
          res.json(memo[0]); // 조회된 메모를 JSON 형태로 응답
      }
  });
};

// 메모 수정
const modifyMemo = (req, res) => {
  const { memo_id } = req.params; // URL 파라미터에서 memo_id 추출
  const { contents } = req.body; // 요청에서 JSON 데이터 추출

  const query = `
      UPDATE memos
      SET contents = ?
      WHERE memo_id = ?;
  `;
  const values = [contents, memo_id];

  req.conn.query(query, values, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to modify memo' });
          return;
      }

      if (result.affectedRows !== 0) {
          res.json({ message: 'Memo modified successfully' }); // 수정 성공 메시지 응답
      } else {
          res.status(404).json({ error: 'Memo not found' }); // 해당 memo_id에 해당하는 Memo가 없는 경우
      }
  });
};

// 메모 삭제
const deleteMemo = (req, res) => {
  const { memo_id } = req.params; // URL 파라미터에서 memo_id 추출

  const query = `
      DELETE FROM memos
      WHERE memo_id = ?;
  `;
  const values = [memo_id];

  req.conn.query(query, values, (err, result) => {
      if (err) {
          console.error(err);
          res.status(500).json({ error: 'Failed to delete memo' });
          return;
      }

      if (result.affectedRows !== 0) {
          res.json({ message: 'Memo deleted successfully' }); // 삭제 성공 메시지 응답
      } else {
          res.status(404).json({ error: 'Memo not found' }); // 해당 memo_id에 해당하는 Memo가 없는 경우
      }
  });
};


router.get("/user/library/memo", viewMemoList);
router.put("/user/library/memo", modifyMemo);
router.delete("/user/library/memo", deleteMemo);

module.exports = router;
const express = require('express');
const router = express.Router();
const conn = require('../db');


/* 피드백 관리 페이지 조회 */
router.get("/", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const query = 'SELECT user_id, name FROM user';

    conn.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).render('', {    //
                result_req: err.message
            });
            return;
        }

        res.render('', {    //
            result_req: "",
            user_list: results
        });
    });
});

/* 회원별 피드백 목록 조회 */
router.get("/:user_id", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const user_id = req.params.user_id;
    const query = 'SELECT feedback_id, contents FROM feedback WHERE user_id = ?';

    conn.query(query, user_id, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).render('', {    //
                result_req: err.message
            });
            return;
        }

        res.render('', {    //
            result_req: "",
            feedback_list: results
        });
    });
});

module.exports = router;
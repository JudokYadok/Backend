const express = require('express');
const router = express.Router();
const conn = require('../db');

/* 회원 관리 페이지 조회 */
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

/* 특정 회원 정보 조회 */
router.get("/:user_id", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const user_id = req.params.user_id;
    const query = 'SELECT * FROM user WHERE user_id = ?';

    conn.query(query, user_id, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).render('', {    //
                result_req: err.message
            });
            return;
        }

        if(results.length > 0){
            res.render('', {    //
                result_req: "",
                user_id: results[0].user_id,
                user_email: results[0].email,
                user_name: results[0].name,
                user_birth: results[0].birthdate,
                user_phone: results[0].phone
            });
        } else {
            res.status(500).render('', {    //
                result_req: "회원 정보가 존재하지 않습니다."
            });
        }

    });
});

/* 회원 정보 삭제 */
router.delete("/:user_id", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const user_id = req.params.user_id;
    const query = 'DELETE FROM user WHERE user_id = ?';

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
        });
    });
})

module.exports = router;
const express = require('express');
const router = express.Router();
const conn = require('../db');
// const crypto = require('crypto');

/* 로그인 페이지 조회 */
router.get("/login", (req, res, next)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    try{
        res.render('', {    //
            result_req: ""
        });
    } catch(err) {
        res.status(500).render('', {    //
            result_req: err.message
        })
    }
});

/* 로그인 */
// 암호화 추가 필요
router.post("/login", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const admin_id = req.body.admin_id;
    const admin_pw = req.body.admin_pw;
    // admin table 따로 만들지 결정 후에 query문 수정
    const query = "SELECT id, pw FROM admin where id = ?";

    conn.query(query, admin_id, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).render('', {    //
                result_req: err.message
            });
            return;
        }

        if(results.length === 0){
            res.status(500).render('', {    //
                result_req: '존재하지 않는 아이디입니다.'
            });
        } else if (results[0].pw !== admin_pw) {
            res.status(500).render('', {    //
                result_req: '비밀번호가 일치하지 않습니다.'
            });
        } else {
            req.session.admin_id = admin_id;
            res.redirect('/admin/');
        }
        
    });
});

/* 로그아웃 */
router.get("/logout", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    try{
        req.session.destroy();
        res.redirect('/admin/');
    } catch(err) {
        res.status(500).render('', {    //
            result_req: err.message
        })
    }
});

module.exports = router;
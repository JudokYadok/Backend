const express = require('express');
const router = express.Router();
const conn = require('../db');

/* 지문 관리 페이지 조회 */
router.get("/", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const query = 'SELECT text_id, title FROM text';

    conn.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).render('', {    // 페이지명 입력
                result_req: err.message
            });
            return;
        }

        res.render('', {    // 페이지명 입력
            result_req: "",
            text_list: results
        });
    });
});

/* 특정 지문 정보 조회 */
router.get("/:text_id", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const text_id = req.params.text_id;
    const query = 'SELECT * FROM text WHERE text_id = ?';

    conn.query(query, text_id, (err, results) => {
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
                text_id: results[0].text_id,
                text_category: results[0].category,
                text_title: results[0].title,
                text_contents: results[0].contents,
            });
        } else {
            res.status(500).render('', {    //
                result_req: "지문이 존재하지 않습니다."
            });
        }

    });
});

/* 지문 추가 페이지 조회 */
router.get("/new", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    try{
        res.render('', {    //페이지명 입력
            result_req: ""
        });
    } catch(err) {
        res.status(500).render('', {    //페이지명 입력
            result_req: err.message
        });
    }
});

/* 지문 추가 */
router.post("/new", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    // 유효성 검사
    const category = req.body.text_category;
    const title = req.body.text_title;
    const contents = req.body.text_contents;
    const user_id = req.session.user_id;
    const query = "INSERT INTO text (user_id, category, title, contents) VALUES (?, ?, ?, ?)";
    const values = [user_id, category, title, contents];

    conn.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).render('', {    // 페이지명 입력
                result_req: err.message
            });
            return;
        }

        res.render('', {    // 페이지명 입력
            result_req: "",
        });
    });
});

/* 지문 수정 */
router.put("/:text_id", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    // 유효성 검사
    const text_id = req.params.text_id;
    const category = req.body.text_category;
    const title = req.body.text_title;
    const contents = req.body.text_contents;
    const query = "UPDATE text SET category = ?, title = ?, contents = ? WHERE text_id = ?";
    const values = [category, title, contents, text_id];

    conn.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).render('', {    // 페이지명 입력
                result_req: err.message
            });
            return;
        }

        res.render('', {    // 페이지명 입력
            result_req: "",
        });
    });
})

/* 지문 삭제 */
router.delete("/:text_id", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const text_id = req.params.text_id;
    const query = 'DELETE FROM text WHERE text_id = ?';
    
    conn.query(query, text_id, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).render('', {    // 페이지명 입력
                result_req: err.message
            });
            return;
        }

        res.render('', {    // 페이지명 입력
            result_req: "",
        });
    });
})

module.exports = router;
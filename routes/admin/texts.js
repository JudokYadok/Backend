const express = require('express');
const router = express.Router();
const conn = require('../db');

/**
 * @swagger
 * tags:
 *   name: Admin-text
 *   description: 지문 관리
 */

/* 지문 관리 페이지 조회 */
/**
 * @swagger
 * paths:
 *   /admin/text:
 *     get:
 *       summary: "지문 관리 페이지 조회"
 *       description: "지문 관리 페이지 렌더링"
 *       tags: [Admin-text]
 *       responses:
 *         "200":
 *           description: "지문 관리 페이지 조회 성공"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "결과 메시지"
 *                   text_list:
 *                     type: object
 *                     description: "지문 목록"
 *                     example:
 *                       [
 *                         { "text_id": 1000, "title": "지문1"}
 *                       ]
 *         "500":
 *           description: "오류 발생"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "오류 메시지"
 */
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
/**
 * @swagger
 * paths:
 *   /admin/text/{text_id}:
 *     get:
 *       summary: "특정 지문 조회"
 *       description: "지문 정보 조회"
 *       tags: [Admin-text]
 *       parameters:
 *         - in: path
 *           name: text_id
 *           required: true
 *           description: "조회할 지문 번호"
 *           schema:
 *             type: number
 *       responses:
 *         "200":
 *           description: "지문 정보 조회 성공"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "결과 메시지"
 *                   text_id:
 *                     type: number
 *                     description: "지문 번호"
 *                   text_category:
 *                     type: string
 *                     description: "지문 유형"
 *                   text_title:
 *                     type: string
 *                     description: "지문 제목"
 *                   text_contents:
 *                     type: string
 *                     description: "지문 내용"
 *         "500":
 *           description: "오류 발생"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "오류 메시지"
 */
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
                //지문 목록 추가
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
/**
 * @swagger
 * paths:
 *   /admin/text/new:
 *     get:
 *       summary: "지문 추가 페이지 조회"
 *       description: "지문 추가 페이지 렌더링"
 *       tags: [Admin-text]
 *       responses:
 *         "200":
 *           description: "지문 추가 페이지 렌더링 성공"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "결과 메시지"
 *         "500":
 *           description: "오류 발생"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "오류 메시지"
 */
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
/**
 * @swagger
 * paths:
 *   /admin/text/new:
 *     post:
 *       summary: "지문 추가"
 *       description: "지문 추가 처리"
 *       tags: [Admin-text]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text_category:
 *                   type: string
 *                   description: "지문 유형"
 *                 text_title:
 *                   type: string
 *                   description: "지문 제목"
 *                 text_contents:
 *                   type: string
 *                   description: "지문 내용"
 *       responses:
 *         "200":
 *           description: "지문 추가 요청 성공"
 *         "500":
 *           description: "오류 발생"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "오류 메시지"
 */
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
        
        //redirect로 변경
        res.render('', {    // 페이지명 입력
            result_req: "",
        });
    });
});

/* 지문 수정 페이지 */

/* 지문 수정 요청*/
/**
 * @swagger
 * paths:
 *   /admin/text/{text_id}:
 *     put:
 *       summary: "지문 수정"
 *       description: "지문 수정 처리"
 *       tags: [Admin-text]
 *       parameters:
 *         - in: path
 *           name: text_id
 *           required: true
 *           description: "수정할 지문 번호"
 *           schema:
 *             type: number
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text_category:
 *                   type: string
 *                   description: "지문 유형"
 *                 text_title:
 *                   type: string
 *                   description: "지문 제목"
 *                 text_contents:
 *                   type: string
 *                   description: "지문 내용"
 *       responses:
 *         "200":
 *           description: "지문 추가 요청 성공"
 *         "500":
 *           description: "오류 발생"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "오류 메시지"
 */
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

        //redirect로 변경
        res.render('', {    // 페이지명 입력
            result_req: "",
        });
    });
})

/* 지문 삭제 */
/**
 * @swagger
 * paths:
 *   /admin/text/{text_id}:
 *     delete:
 *       summary: "지문 삭제"
 *       description: "지문 삭제 처리"
 *       tags: [Admin-text]
 *       parameters:
 *         - in: path
 *           name: text_id
 *           required: true
 *           description: "삭제할 지문 번호"
 *           schema:
 *             type: number
 *       responses:
 *         "200":
 *           description: "지문 삭제 요청 성공"
 *         "500":
 *           description: "오류 발생"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "오류 메시지"
 */
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

        //redirect로 변경
        res.render('', {    // 페이지명 입력
            result_req: "",
        });
    });
})

module.exports = router;
const express = require('express');
const router = express.Router();

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
router.get("", adminRequire, (req, res)=>{
    const query = 'SELECT text_id, title FROM text';

    req.conn.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                result_req: err.message
            });
            return;
        }

        res.status(200).render('contents_list', {    // 페이지명 입력
            result_req: "지문 관리 페이지 조회 성공",
            text_list: results
        });
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
    const query = 'SELECT text_id, title FROM text';

    req.conn.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                result_req: err.message
            });
            return;
        }

        res.status(200).render('contents_new', {    // 페이지명 입력
            result_req: "지문 추가 페이지 조회 성공",
            text_list: results
        });
    });
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
    // 유효성 검사
    const category = req.body.text_category;
    const title = req.body.text_title;
    const contents = req.body.text_contents;
    const user_id = req.session.user_id;
    const query = "INSERT INTO text (user_id, category, title, contents) VALUES (?, ?, ?, ?)";
    const values = [user_id, category, title, contents];

    req.conn.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                result_req: err.message
            });
            return;
        }
        
        //redirect로 변경
        res.redirect('/admin/text')
    });
});

/* 지문 수정 페이지 */
/**
 * @swagger
 * paths:
 *   /admin/text/new/{text_id}:
 *     get:
 *       summary: "지문 수정 페이지 조회"
 *       description: "지문 수정 페이지 렌더링"
 *       tags: [Admin-text]
 *       parameters:
 *         - in: path
 *           name: text_id
 *           required: true
 *           description: "수정할 지문 번호"
 *           schema:
 *             type: number
 *       responses:
 *         "200":
 *           description: "지문 수정 페이지 조회 성공"
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
router.get("/new/:text_id", (req, res)=>{
    const text_id = req.params.text_id;
    const query = 'SELECT * FROM text WHERE text_id = ?';
    const query2 = 'SELECT text_id, title FROM text';

    req.conn.query(query, text_id, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                result_req: err.message
            });
            return;
        }

        if(results.length > 0){
            const text_data = results[0];
            req.conn.query(query2, (err, results2) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        result_req: err.message
                    });
                    return;
                }

                res.status(200).render('contents_update', {
                    result_req: "지문 수정 페이지 조회 성공",
                    text_list: results2,
                    text_id: text_data.text_id,
                    text_category: text_data.category,
                    text_title: text_data.title,
                    text_contents: text_data.contents
                });
            })
        } else {
            res.status(500).json({
                result_req: "지문이 존재하지 않습니다."
            });
        }

    });
});

/* 지문 수정 요청*/
/**
 * @swagger
 * paths:
 *   /admin/text/new/{text_id}:
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
router.post("/new/:text_id", (req, res)=>{
    // 유효성 검사
    const text_id = req.params.text_id;
    const category = req.body.text_category;
    const title = req.body.text_title;
    const contents = req.body.text_contents;
    const query = "UPDATE text SET category = ?, title = ?, contents = ? WHERE text_id = ?";
    const values = [category, title, contents, text_id];

    req.conn.query(query, values, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                result_req: err.message
            });
            return;
        }

        //redirect로 변경
        res.redirect('/admin/text/' + text_id);
    });
})

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
 *                   text_list:
 *                     type: object
 *                     description: "지문 목록"
 *                     example:
 *                       [
 *                         { "text_id": 1000, "title": "지문1"}
 *                       ]
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
    const text_id = req.params.text_id;
    const query = 'SELECT * FROM text WHERE text_id = ?';
    const query2 = 'SELECT text_id, title FROM text';

    req.conn.query(query, text_id, (err, results1) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                result_req: err.message
            });
            return;
        }

        if(results1.length > 0){
            const text_data = results1[0];
            req.conn.query(query2, (err, results2) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        result_req: err.message
                    });
                    return;
                }

                res.status(200).render('contents', {    // 페이지명 입력
                    result_req: "지문 정보 조회 성공",
                    text_list: results2,
                    text_id: text_data.text_id,
                    text_category: text_data.category,
                    text_title: text_data.title,
                    text_contents: text_data.contents
                });
            })
        } else {
            res.status(500).json({
                result_req: "지문이 존재하지 않습니다."
            });
        }

    });
});

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
    const text_id = req.params.text_id;
    const query = 'DELETE FROM text WHERE text_id = ?';
    
    req.conn.query(query, text_id, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
                result_req: err.message
            });
            return;
        }
        res.status(200).json({
            result_req: '지문 삭제 성공'
        });
    });
})

module.exports = router;
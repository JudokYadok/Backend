const express = require('express');
const router = express.Router();
const conn = require('../db');

/**
 * @swagger
 * tags:
 *   name: Admin-feedback
 *   description: 피드백 관리
 */

/* 피드백 관리 페이지 조회 */
/**
 * @swagger
 * paths:
 *   /admin/feedback:
 *     get:
 *       summary: "피드백 관리 페이지 조회"
 *       description: "피드백 관리 페이지 렌더링"
 *       tags: [Admin-feedback]
 *       responses:
 *         "200":
 *           description: "피드백 관리 페이지 조회 성공"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "결과 메시지"
 *                   user_list:
 *                     type: object
 *                     description: "유저 목록"
 *                     example:
 *                       [
 *                         { "user_id": 1000, "name": "회원1"}
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
    const query = 'SELECT user_id, name FROM user';
    conn.query(query, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
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
/**
 * @swagger
 * paths:
 *   /admin/feedback/{user_id}:
 *     get:
 *       summary: "회원별 피드백 조회"
 *       description: "회원별 피드백 목록 페이지 렌더링"
 *       tags: [Admin-feedback]
 *       parameters:
 *         - in: path
 *           name: user_id
 *           required: true
 *           description: 조회할 회원 번호
 *           schema:
 *             type: number
 *       responses:
 *         "200":
 *           description: "회원별 피드백 목록 조회 성공"
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   result_req:
 *                     type: string
 *                     description: "결과 메시지"
 *                   feedback_list:
 *                     type: object
 *                     description: "피드백 목록"
 *                     example:
 *                       [
 *                         { "feedback_id": 1000, "content": "피드백 내용"}
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
router.get("/:user_id", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    const user_id = req.params.user_id;
    const query = 'SELECT feedback_id, contents FROM feedback WHERE user_id = ?';

    conn.query(query, user_id, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({
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
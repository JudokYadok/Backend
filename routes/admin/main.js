const express = require('express');
const router = express.Router();


/* 관리자 메인 화면 조회 */
router.get("/", (req, res)=>{
    res.writeHead(200, {'Content-Type': 'application/json'});
    try{
        res.render('', {    //페이지명 입력
            result_req: ""
        });
    } catch(err) {
        res.status(500).render('', {    //페이지명 입력
            result_req: err.message
        })
    }
});

module.exports = router;
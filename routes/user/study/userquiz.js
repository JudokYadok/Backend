const express = require("express");
const router = express.Router();
const execsync = require("child-process");

const app = express();

// 사용자 지문 퀴즈 생성
const createUsertextQuiz = (req, res) => {

};

// 사용자 지문 퀴즈 채점
const markUsertextQuiz = (req, res) => {

};

// 사용자 지문 퀴즈 저장
const saveUsertextQuiz = (req, res) => {
    // 
};


router.post("/", createUsertextQuiz);
router.post("/result", markUsertextQuiz);
router.post("/save", saveUsertextQuiz);

module.exports = router;
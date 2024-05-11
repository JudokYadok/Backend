const express = require("express");
const router = express.Router();
const execsync = require("child-process");

const app = express();

// 기출 지문 퀴즈 생성
const createPrevQuiz = (req, res) => {
    // content_match.py 실행
    // 결과값 받아오기
    // 받아온 값 DB에 저장
};

// 기출 지문 퀴즈 채점
const markPrevQuiz = (req, res) => {
    // 
};

// 사용자 지문 퀴즈 생성
const createMyQuiz = (req, res) => {

};

// 사용자 지문 퀴즈 채점
const markMyQuiz = (req, res) => {

};

router.post("/prevtext/:category/:text_id/quiz", createPrevQuiz);
router.post("/prevtext/:category/:text_id/quiz/result", markPrevQuiz);
router.post("/mytext/:category/:text_id/quiz", createMyQuiz);
router.post("/mytext/:category/:text_id/quiz/result", markMyQuiz);
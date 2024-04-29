const { Router } = require("express");
const passport = require("passport");

// 카카오 서버 로그인 라우터
Router.get('/kakao', passport.authenticate('kakao'));

// 카카오 redirect url 설정에 따라 서버 라우터로 요청
Router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/', // kakaoStrategy에서 실패 시 실행
}),
    (req, res) => {
        res.redirect('/'); // kakaoStrategy에서 성공 시 콜백 실행
    }
)

module.exports = Router;
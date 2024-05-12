const jwt = require('./jwt');

function adminRequire(req, res, next){
    if(req.session.user_id) {
        next();
    }else{
        res.redirect('/admin/login');
    }
}

function tokenRequire(access_token, refresh_token, next) {
    const access_result = jwt.verify(access_token);
    if(access_result.ok){
        next();
    } else {
        const refresh_result = jwt.verify(refresh_token);
        // 리프레시 토큰이 유효하면 새 액세스 토큰 발급하여 반환
        if(refresh_result.ok){
            const new_token = jwt.sign(refresh_result.id);
            // 반환하는 부분 추가
            next()
        } else {
            // 토큰 만료 -> 로그인 재요청
        }
    }
}

module.exports = { adminRequire, tokenRequire };
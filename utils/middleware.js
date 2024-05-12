const jwt = require('./jwt');

function adminRequire(req, res, next){
    if(req.session.user_id) {
        next();
    }else{
        res.redirect('/admin/login');
    }
}

function tokenRequire(req, res, next) {
    const access_token = req.headers["authorization"];
    const refresh_token = req.headers["refresh"];   //req.cookies.refresh_token;

    const access_result = jwt.verify(access_token);
    if(access_result.ok){
        next();
    } else {
        const refresh_result = jwt.verify(refresh_token);
        // 리프레시 토큰이 유효하면 새 액세스 토큰 발급하여 반환
        if(refresh_result.ok){
            const new_token = jwt.sign(access_token.id);
            // res.cookie('access_token', new_token, { httpOnly: true })
            next()
        } else {
            res.status(403).send({
                result_req: "토큰 만료됨, 재로그인 필요"
            });
        }
    }
}

module.exports = { adminRequire, tokenRequire };
function adminRequire(req, res, next){
    if(req.session.user_id) {
        next();
    }else{
        res.redirect('/admin/login');
    }
}

module.exports = { adminRequire };
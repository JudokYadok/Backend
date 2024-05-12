const jwt = require('./jwt');

function adminRequire(req, res, next){
    if(req.session.user_id) {
        next();
    }else{
        res.redirect('/admin/login');
    }
}

function tokenRequire(token, next) {
    const result = jwt.verify(token);
    if(result.ok){
        next();
    } else {
        
    }
}

module.exports = { adminRequire };
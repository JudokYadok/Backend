require('dotenv').config();

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET_KEY;

module.exports = {

    sign: (user_id) => { // access token 발급
        const payload = { // access token에 들어갈 payload
        id: user_id,
        };

        return jwt.sign(payload, secret, { // secret으로 sign하여 발급하고 return
            algorithm: 'HS256', // 암호화 알고리즘
            expiresIn: '6h', 	  // 유효기간
        });
    },

    verify: (token) => { // access token 검증
        let decoded = null;
        try {
            decoded = jwt.verify(token, secret);
            return {
                ok: true,
                id: decoded.id,
            };
        } catch (err) {
            return {
                ok: false,
                message: err.message,
            };
        }
    },

    refresh: () => { // refresh token 발급
        return jwt.sign({}, secret, {
            algorithm: 'HS256',
            expiresIn: '14d',
        });
    },

    refreshVerify: async (req, token, user_id) => { // refresh token 검증
        try {
            const query = `SELECT refresh FROM token WHERE user_id = ?`;

            req.conn.query(query, user_id, (err, results) => {
                if (err) {
                    console.error(err);
                } else {
                    if(results[0].refresh === token){
                        jwt.verify(token, secret);
                        return true;
                    } else {
                        return false;
                    }
                }
            });
        } catch (err) {
            console.error(err)
            return false;
        }
    },
};
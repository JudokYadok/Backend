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
                id: decoded.id,
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

            return new Promise((resolve, reject) => {
                req.conn.query(query, user_id, (err, results) => {
                    if (err) {
                        console.error(err);
                        reject(err); // 오류 발생 시 reject 호출
                    } else {
                        if(results[0].refresh === token){
                            // 토큰이 일치할 경우 resolve 호출하여 검증 결과 반환
                            jwt.verify(token, secret, (err, decoded) => {
                                if (err) {
                                    console.error(err);
                                    reject(err); // 검증 실패 시 reject 호출
                                } else {
                                    resolve(decoded); // 검증 성공 시 resolve 호출하여 결과 반환
                                }
                            });
                        } else {
                            resolve(false); // 토큰이 일치하지 않을 경우 false 반환
                        }
                    }
                });
            });
        } catch (err) {
            console.error(err)
            return false;
        }
    },
};
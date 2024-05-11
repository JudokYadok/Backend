require('dotenv').config();

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const redisClient = require('./redis');
const secret = process.env.JWT_SECRET_KEY;


module.exports = {
  sign: (user_id) => { // access token 발급
    const payload = { // access token에 들어갈 payload
      id: user_id,
    };

    return jwt.sign(payload, secret, { // secret으로 sign하여 발급하고 return
      algorithm: 'HS256', // 암호화 알고리즘
      expiresIn: '1h', 	  // 유효기간
    });
  },
  verify: (token) => { // access token 검증
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      return {
        ok: true,
        id: decoded.id,
        role: decoded.role,
      };
    } catch (err) {
      return {
        ok: false,
        message: err.message,
      };
    }
  },
  refresh: () => { // refresh token 발급
    return jwt.sign({}, secret, { // refresh token은 payload 없이 발급
      algorithm: 'HS256',
      expiresIn: '14d',
    });
  },
  refreshVerify: async (token, userId) => { // refresh token 검증
    const getAsync = promisify(redisClient.get).bind(redisClient);
    
    try {
      const data = await getAsync(userId); // refresh token 가져오기
      if (token === data) {
        try {
          jwt.verify(token, secret);
          return true;
        } catch (err) {
          return false;
        }
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  },
};
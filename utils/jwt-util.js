require('dotenv').config();

const jwt = require('jsonwebtoken'); // jwt 모듈 불러오기
const secretKey = process.env.JWT_SECRET_KEY;

// access token 생성
const generateToken = (payload) => {
  const token = jwt.sign(payload, secretKey, {
      algorithm: 'HS256',
      expiresIn: '6h', 
    });

    return token;
}; // jwt.sign() 메서드를 통해 jwt 토큰 발행

// refresh token 생성
const refreshToken = () => {
  try {
    const token = jwt.sign({}, secretKey, {
      algorithm: 'HS256',
      expiresIn: '14d'
    });
    return token;
  } catch (error) {
    // 토큰 새로 고침 중 오류 발생 시 출력
    console.error('Error refreshing token:', error);
    return null;
  }
};

module.exports = { generateToken, refreshToken };
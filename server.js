const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 60023;

// 라우팅 모듈
const kakaoAuth = require('./routes/auth');

// MySQL 연결 생성
const connection = mysql.createConnection(dbConfig);

// 연결 테스트
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: '주독야독 API',
            version: '1.0.0',
            description: '주독야독 API 문서',
        },
    },
    apis: ['./routes/admin/*.js'],  // 필요 시 배열 형식으로 파일 경로 추가
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 라우팅
app.use('/user/login', kakaoAuth);

// 서버 종료 시 MySQL 연결 종료
process.on("SIGINT", () => {
    connection.end();
    process.exit();
  });

const server = app.listen(port, () => {
    const { address, port } = server.address();
    console.log(`Server is running on http://${address}:${port}`);
    console.log(`Swagger --> http://${address}:${port}/api-docs`);
})
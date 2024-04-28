const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const session = require('express-session');
const ejs = require("ejs");

const app = express();
const port = 60023;

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

/* 데이터 파싱 */
app.use(express.json())
app.use(express.urlencoded({extended: true}))

/* 세션 사용 설정 */
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
    }))

/* ejs 사용 설정 */
app.set("view engine", "ejs")
// app.set("views", /* ejs 파일 경로 ex)"./views" */)

/* 관리자 기능 라우터 */
// 관리자 메인 화면 로드
const adminMainRouter = require('./routes/admin/main');
// 관리자 인증
const adminAuthRouter = require('./routes/admin/auth');
// 회원 관리
const manageUserRouter = require('./routes/admin/users');
// 지문 관리
const manageTextRouter = require('./routes/admin/texts');
// 피드백 관리
const manageFeedbackRouter = require('./routes/admin/feedback');
// AI 관리
// const manageAiRouter = require('./routes/admin/ai');

// 관리자 기능 router 활성화
app.use('/admin', adminMainRouter);
app.use('/admin', adminAuthRouter);
app.use('/admin/users', manageUserRouter);
app.use('/admin/text', manageTextRouter);
app.use('/admin/feedback', manageFeedbackRouter);
// app.use('/admin/ai', manageAiRouter);

const server = app.listen(port, () => {
    const { address, port } = server.address();
    console.log(`Server is running on http://${address}:${port}`);
    console.log(`Swagger --> http://${address}:${port}/api-docs`);
})
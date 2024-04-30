const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const session = require('express-session');
const ejs = require('ejs');
const mysql = require('mysql');

const app = express();
const port = 60023;

// 테스트용 DB 정보
const dbConfig = {
    host: 'localhost',
    user:  '',
    password: '',
    database: 'TestDB0430',
}

/* 라우팅 모듈 */
const adminMainRouter = require('./routes/admin/main');
const adminAuthRouter = require('./routes/admin/auth');
const manageUserRouter = require('./routes/admin/users');
const manageTextRouter = require('./routes/admin/text');
const manageFeedbackRouter = require('./routes/admin/feedback');
// const manageAiRouter = require('./routes/admin/ai');

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

app.use((req, res, next) => {
    req.conn = connection;
    next();
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

/* 데이터 파싱 */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

/* 세션 사용 설정 */
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
    }));

/* ejs 사용 설정 */
app.set("view engine", "ejs");
app.set("views", "./views");


// 관리자 기능 router 활성화
app.use('/admin', adminMainRouter);
app.use('/admin', adminAuthRouter);
app.use('/admin/users', manageUserRouter);
app.use('/admin/text', manageTextRouter);
app.use('/admin/feedback', manageFeedbackRouter);
// app.use('/admin/ai', manageAiRouter);

// 서버 종료 시 MySQL 연결 종료
process.on("SIGINT", () => {
    connection.end();
    process.exit();
});

const server = app.listen(port, () => {
    const { address, port } = server.address();
    console.log(`Server is running on http://${address}:${port}`);
    console.log(`Swagger --> http://${address}:${port}/api-docs`);
});
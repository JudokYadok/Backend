const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const session = require('express-session');
const ejs = require('ejs');
const mysql = require('mysql');
const dbConfig = require('./dbconfig');

const app = express();
const port = 60023;

// 관리자 라우팅 모듈
const adminMainRouter = require('./routes/admin/home');
const adminAuthRouter = require('./routes/admin/auth');
const manageUserRouter = require('./routes/admin/users');
const manageTextRouter = require('./routes/admin/text');
const manageFeedbackRouter = require('./routes/admin/feedback');
// const manageAiRouter = require('./routes/admin/ai');

// 사용자 라우팅 모듈
const userTextRouter = require('./routes/user/study/usertext');
const prevextRouter = require('./routes/user/study/prevtext');
const myTextRouter = require('./routes/user/library/mytext');

// 세션 사용 설정
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'keyboard cat'
    }));

// 데이터 파싱
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ejs 사용 설정
app.set("view engine", "ejs");
app.set("views", "./views");

app.use("/images", express.static(__dirname+"/public/images"));

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

// 관리자 라우팅 (Web)
app.use('/admin', adminMainRouter);
app.use('/admin', adminAuthRouter);
app.use('/admin/users', manageUserRouter);
app.use('/admin/text', manageTextRouter);
app.use('/admin/feedback', manageFeedbackRouter);
// app.use('/admin/ai', manageAiRouter);

// 사용자 라우팅 (App)
app.use('/')

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: '주독야독 API',
            version: '1.0.0',
            description: '주독야독 API 문서',
        },
        servers: [
            {
                url: "http://ceprj.gachon.ac.kr:" + port,
            },
        ],
    },
    apis: ['./routes/admin/*.js', './routes/*.js'],  // 필요 시 배열 형식으로 파일 경로 추가
}

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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
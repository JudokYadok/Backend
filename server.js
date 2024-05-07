const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const ejs = require('ejs');
const app = express();
const port = 60023;

// ejs 사용 설정
app.set("view engine", "ejs");
app.set("views", "./views");
app.use("/images", express.static(__dirname+"/public/images"));

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

const server = app.listen(port, () => {
    const { address, port } = server.address();
    console.log(`Server is running on http://${address}:${port}`);
    console.log(`Swagger --> http://${address}:${port}/api-docs`);
})
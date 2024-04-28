const express = require('express');

const app = express();
const port = 60023;

const ejs = require("ejs");
app.set("view engine", "ejs")
// app.set("views", /* ejs 파일 경로 "./views" */)

const server = app.listen(port, () => {
    const { address, port } = server.address();
    console.log(`Server is running on http://${address}:${port}`);
})
// database 연결
const mysql = require('mysql');

const conn = mysql.createConnection({
    host: 'localhost',
    user:  '',
    password: '',
    database: '',
});

module.exports = conn;
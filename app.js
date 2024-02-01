const express = require('express');
const mysql = require('mysql2/promise'); // mysql2의 promise 버전 사용
const app = express();
const port = 12345;
const http = require("http")
const https = require("https")
const fs = require("fs")

var privateKey = fs.readFileSync("/etc/letsencrypt/live/mokkitlink.store/privkey.pem")
var certificate = fs.readFileSync("/etc/letsencrypt/live/mokkitlink.store/cert.pem")
var ca = fs.readFileSync("/etc/letsencrypt/live/mokkitlink.store/fullchain.pem")
const credentials = { key: privateKey, cert: certificate, ca: ca }

// MySQL 연결 설정
const pool = mysql.createPool({
  host: 'db-lck7f.pub-cdb.ntruss.com', // MySQL 호스트
  user: 'mokkitlink_root', // MySQL 사용자
  password: 'mokkitlink_root123!', // MySQL 비밀번호
  database: 'public', // 사용할 데이터베이스 이름
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 루트 엔드포인트
app.get('/', async (req, res) => {
  try {
    // MySQL에서 데이터를 가져오는 SELECT 쿼리
    const [rows, fields] = await pool.execute('SELECT * FROM User');
    // console.log("credentilas", credentials)  
    // 가져온 데이터를 콘솔에 출력
    console.log('Query Result:', rows);

    // 클라이언트에 응답
    res.json(rows);
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).send('Internal Server Error');
  }
});


// 서버 시작
http.createServer(app).listen(80)
https.createServer(credentials, app).listen(443)
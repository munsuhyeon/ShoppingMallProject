const express = require("express")
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")
const mysql = require("mysql2")
const mysqlPromise = require("mysql2/promise");
const dotenv = require("dotenv")
const path = require("path")
const port = 8000;
const bcrypt = require("bcrypt");
const { rejects } = require("assert");

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())
dotenv.config();
// 정적 파일을 제공하기 위해 디렉토리를 설정합니다.
app.use(express.static(path.join(__dirname + "/images")));
// 환경변수에서 데이터베이스 연결 정보를 가져옵니다.
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASWORD,
    database : process.env.DB_DATABASE,
    port: process.env.DB_PORT,
})
connection.connect((err) => {
    if(err){
        console.error(" MySQL 접속에러: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as id " + connection.threadId);
})
/*=================   회원가입   =====================*/
app.post('/register', async(req,res) => {
    // 클라이언트에서 받은 회원가입 정보
    let{
        userId,
        userPassword,
        userName,
        userPhone,
        userEmail,
        zonecode,
        address,
        detailAddress
    } = req.body;
    console.log("서버 :::   ", req.body)

    try{
        // 아이디 중복체크와 이메일 중복체크가 동시에 일어나지 않도록 promise 사용
        // DB에 저장 전 id  중복체크
        const checkIdSql = "SELECT user_id FROM user where user_id = ?"
        const idResult = await new Promise((resolve,rejects) => {
            connection.query(checkIdSql, [userId], (err, result) => {
                if(err) reject(err);
                else resolve(result)
            });
        });
        if(idResult.length > 0){
            return res.status(200).json({
                success: false,
                message: "이미 등록된 아이디입니다"
            });
        }

        // 이메일 저장 전 중복 체크
        const checkEmailSql = "SELECT user_email FROM user where user_email = ?"
        const emailResult = await new Promise((resolve, reject) => {
            connection.query(checkEmailSql, [userEmail], (err,result) => {
                if(err) reject(err);
                else resolve(result);
            })
        });
        if(emailResult.length > 0){
            return res.status(200).json({
                success: false,
                message: "이미 존재하는 이메일 아이디입니다"
            });
        }
        // 비밀번호 암호화
        const salt = await bcrypt.genSalt(10); //매개변수 10은 "cost factor" 또는 "work factor"라고 불리며, 해싱 알고리즘의 반복 횟수를 결정
        const hash = await bcrypt.hash(userPassword, salt);
        userPassword = hash;
        console.log("비밀번호 암호화 :::   ", userPassword);
        // 회원정보 DB에 저장
        const registerSql = "INSERT INTO user (user_id, user_pw, user_name, user_email, user_phone, address, address_detail) values(?,?,?,?,?,?,?)";
        await new Promise((resolve,reject) => {
            connection.query(registerSql,[userId,userPassword,userName,userEmail,userPhone,address,detailAddress],(err,result) => {
                if(err) reject(err);
                else resolve(result);
            });
        });

        // 회원가입이 성공한 경우 클라이언트에게 응답을 보낸다
        console.log("사용자가 성공적으로 등록")
        return res.status(200).json({
            success:true,
            message: "회원가입이 등록되었습니다"
        });
    } catch (err) {
        console.error("서버에서 오류 발생 : ", err);
        return res.status(500).json({
            success: false,
            message: "회원가입 중 오류가 발생하였습니다",
            error: err.message
        });
    };
})
app.listen(port, () => console.log(`${port}번으로 노드 서버 실행`))
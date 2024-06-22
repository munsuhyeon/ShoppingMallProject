const express = require("express");
const app = express();
const cors = require("cors")
const bodyParser = require("body-parser")
const mysql = require("mysql2");
const dotenv = require("dotenv")
const path = require("path")
const bcrypt = require("bcrypt");
const cookieParser = require('cookie-parser');
const jwt = require("jsonwebtoken") // npm install jsonwebtoken
const {generateAccessToken, generateRefreshToken} = require("./middleware/Token.js");

// 미들웨어 설정
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000', // origin 옵션은 허용할 출처(도메인)를 지정
    credentials: true, // credentials: true는 자격 증명(쿠키, 인증 헤더 등)을 포함한 요청을 허용할지 여부를 지정
    exposedHeaders: ['Authorization']
}));
dotenv.config();
const port = 8000;
// 정적 파일을 제공하기 위해 디렉토리를 설정합니다.
app.use(express.static(path.join(__dirname + "/images")));
app.use(express.static(path.join(__dirname, "/images/도서")));
app.use(express.static(path.join(__dirname, "/images/스포츠")));
app.use(express.static(path.join(__dirname, "/images/사무용품")));
app.use(express.static(path.join(__dirname, "/images/반려동물용품")));
app.use(express.static(path.join(__dirname, "/images/인테리어")));

// + 더  카테고리 추가

// 환경변수에서 데이터베이스 연결 정보를 가져옵니다.
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, JWT_SECRET } = process.env;

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});
connection.connect((err) => {
  if (err) {
    console.error(" MySQL 접속에러: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});
/*=================   회원가입   =====================*/
app.post('/api/register', async(req,res) => {
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

    try{
        // 아이디 중복체크와 이메일 중복체크가 동시에 일어나지 않도록 promise 사용
        // DB에 저장 전 id  중복체크
        const checkIdSql = "SELECT user_id FROM user where user_id = ?"
        const idResult = await new Promise((resolve,reject) => {
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
});

/*=================   main - 상품 데이터 불러오기   =====================*/

// 상품 데이터를 가져오는 API 엔드포인트
app.get("/shop", (req, res) => {
  const sqlQuery = "SELECT * FROM bluewave.product;";
  connection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("상품을 가져오는 중 오류 발생:", err);
      res.status(500).send("상품을 가져오는 중 오류 발생");
      return;
    }
    res.json(result);
  });
});

/*=================   상품   =====================*/

// 주소 수정필요
// 상품 목록을 가져오는 엔드포인트
app.get("/product", (req, res) => {
  const sqlQuery = "SELECT * FROM bluewave.product;";
  connection.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Error fetching products:", err);
      res.status(500).send("Error fetching products");
      return;
    }
    res.json(result);
  });
});

app.get("/product/:categoryId", (req, res) => {
  const { categoryId } = req.params;
  const sqlQuery = `
    SELECT p.* 
    FROM product p
    WHERE p.category_id = ?
  `;

  connection.query(sqlQuery, [categoryId], (err, results) => {
    if (err) {
      console.error("Error fetching products by category:", err);
      res.status(500).json({ error: "Error fetching products by category" });
      return;
    }
    res.json(results);
  });
});

app.get("/product/:categoryId/:subCategoryId", (req, res) => {
  const { categoryId, subCategoryId } = req.params;
  const sqlQuery = `
    SELECT p.* 
    FROM product p
    WHERE p.category_id = ? AND p.sub_category_id = ?;
  `;

  connection.query(sqlQuery, [categoryId, subCategoryId], (err, results) => {
    if (err) {
      console.error("Error fetching products by subcategory:", err);
      res.status(500).json({ error: "Error fetching products by subcategory" });
      return;
    }
    res.json(results);
  });
});

// 특정 상품을 가져오는 엔드포인트
app.get("/product/:categoryId/:subCategoryId/:id", (req, res) => {
  const productId = req.params.id;
  const sqlQuery = "SELECT * FROM bluewave.product WHERE product_id = ?;";

  connection.query(sqlQuery, [productId], (err, result) => {
    if (err) {
      console.error("Error fetching product details:", err);
      res.status(500).send("Error fetching product details");
      return;
    }
    if (result.length === 0) {
      res.status(404).send("Product not found");
      return;
    }
    res.json(result[0]);
  });
});

// product_id에 해당하는 상품 옵션 조회 엔드포인트
app.get("/product/:categoryId/:subCategoryId/:id/options", (req, res) => {
  const productId = req.params.id; // URL의 params에서 product_id 가져오기

  // MySQL에서 product_id에 해당하는 상품 옵션 데이터 조회 쿼리
  const sql =
    "SELECT option_name, option_price FROM bluewave.option WHERE product_id = ?;";

  connection.query(sql, [productId], (err, results) => {
    if (err) {
      console.error("상품 옵션 조회 오류:", err);
      res.status(500).json({ error: "상품 옵션 조회 오류" });
      return;
    }

    // 조회된 옵션 데이터 응답
    res.json(results);
  });
});
/*=================   로그인   =====================*/
app.post('/api/login', async (req,res) => {
    let {userId, userPassword} = req.body; // 클라이언트에서 받은 로그인정보
    try{
        // 전달받은 아이디로 아이디와 비밀번호 찾기
        const findIdSql = "SELECT user_id,user_pw FROM user WHERE user_id = ?";

        const findUserResult = await new Promise((resolve, reject) => {
            connection.query(findIdSql,[userId], (err,result) => {
                if(err) reject(err);
                else resolve(result);
            })
        });
        // 일치하는 아이디가 없다면 클라이언트에 에러메세지 전달
        if(findUserResult.length === 0){
            return res.status(401).json({
                success: false,
                message: "all wrong"
            })
        };

        // 일치하는 아이디가 있다면 쿼리문의 결과값에서 유저 비밀번호 추출
        const dbPassword = findUserResult[0].user_pw;

        // 사용자가 입력한 비밀번호와 일치하는지 체크 (입력한 비밀번호, DB에 저장된 비밀번호)
        const isMatch = await bcrypt.compare(userPassword,dbPassword);
        if(!isMatch){
            // 입력한 비밀번호가 틀리다면
            return res.status(401).json({
                sucess: false,
                message: "wrong password"
            })
        } else {
            // 입력한 비밀번호가 맞다면 토큰을 생성
            const payload = { "userId" : findUserResult[0].user_id };
            const accessToken = generateAccessToken(payload);
            const refreshToken = generateRefreshToken(payload);
            
            const verified = jwt.verify(accessToken, JWT_SECRET); // { userId: 'star1234', iat: 1719076826, exp: 1719080426 }
            let decodedExp =  verified.exp - verified.iat; // 생성 - 만료 = 유효시간

            // 쿠키에 refresh토큰을 저장하고, 클라이언트에게 JSON 응답 반환
            console.log({
                success: true,
                message: '로그인 성공',
                token: decodedExp,
            });
            // refreshToken을 서버의 쿠키에 저장
            res.cookie('refreshToken', refreshToken, {
              httpOnly: true,
              secure: false, // HTTPS를 사용할 경우 true로 변경
              maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
              sameSite: 'strict' // 적절한 SameSite 설정을 적용하세요
            });

            return res.status(200)
                .header('authorization', accessToken)
                .json({
                    success: true,
                    message: '로그인 성공',
                    tokenExp: decodedExp,
                    userId : findUserResult[0].user_id
                });
        }
    } catch(err){
        console.error("서버에서 오류 발생 : ", err);
        return res.status(500).json({
            success: false,
            message: "로그인 중 오류가 발생하였습니다",
            error: err.message
        });
    }
});
/*=================   토큰 검증   =====================*/
app.get('/api/verify-token', (req, res) => {
    const authHeader = req.headers.authorization;
    // Bearer이 붙어있어서 띄어쓰기로 토큰을 구분한다
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        // 로그인페이지로 이동하기
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, JWT_SECRET, (err, userID) => {
        if(err){
            // 로그인페이지로 이동하기
            return res.status(403).json({message:"토큰 확인 실패"});
        }
        return res.status(200).json({valid:true, userId:userID});
    });
});
/*=================   refreshToken으로 accessToken 재발급   =====================*/
app.get('/api/refresh-token', (req,res) => {
  const refreshToken = req.cookies['refreshToken'];

    if(!refreshToken){
        console.log("refresh토큰 없음")
        // 사용자를 로그인페이지로 이동시키기
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try{
        const decoded = jwt.verify(refreshToken, JWT_SECRET);
        const newAccessToken = generateAccessToken({ "userId" : decoded.userId });
        return res.status(200).json({newToken : newAccessToken});
    }catch(error){
      // 토큰 검증 실패
      if (error.name === 'TokenExpiredError') {
          console.log("토큰 만료");
          return res.status(403).json({ message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
          console.log("유효하지 않은 토큰");
          return res.status(403).json({ message: 'Invalid token' });
      } else {
          console.log("기타 에러 발생:", error.message);
          return res.status(500).json({ message: 'Internal server error' });
      }
    }
});
/*==========================================================*/
app.listen(port,() => console.log(`${port}번으로 서버 실행`))


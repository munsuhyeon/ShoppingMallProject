const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcrypt");
const { reject } = require("assert");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./middleware/Token.js");

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // origin 옵션은 허용할 출처(도메인)를 지정
    credentials: true, // credentials: true는 자격 증명(쿠키, 인증 헤더 등)을 포함한 요청을 허용할지 여부를 지정
    exposedHeaders: ["Authorization"],
  })
);
dotenv.config();
const port = 8000;

// 정적 파일을 제공하기 위해 디렉토리를 설정합니다.
app.use("/img", express.static(path.join(__dirname, "img")));
app.use(express.static(path.join(__dirname + "/images")));
app.use(express.static(path.join(__dirname, "/images/도서")));
app.use(express.static(path.join(__dirname, "/images/스포츠")));
app.use(express.static(path.join(__dirname, "/images/사무용품")));
app.use(express.static(path.join(__dirname, "/images/반려동물용품")));
app.use(express.static(path.join(__dirname, "/images/인테리어")));
app.use(express.static(path.join(__dirname, "/images/디지털")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// 환경변수에서 데이터베이스 연결 정보를 가져옵니다.
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT, JWT_SECRET } =
  process.env;

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
app.post("/api/register", async (req, res) => {
  // 클라이언트에서 받은 회원가입 정보
  let {
    userId,
    userPassword,
    userName,
    userPhone,
    userEmail,
    zonecode,
    address,
    detailAddress,
  } = req.body;

  try {
    // 아이디 중복체크와 이메일 중복체크가 동시에 일어나지 않도록 promise 사용
    // DB에 저장 전 id  중복체크
    const checkIdSql = "SELECT user_id FROM user where user_id = ?";
    const idResult = await new Promise((resolve, reject) => {
      connection.query(checkIdSql, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (idResult.length > 0) {
      return res.status(200).json({
        success: false,
        message: "이미 등록된 아이디입니다",
      });
    }

    // 이메일 저장 전 중복 체크
    const checkEmailSql = "SELECT user_email FROM user where user_email = ?";
    const emailResult = await new Promise((resolve, reject) => {
      connection.query(checkEmailSql, [userEmail], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (emailResult.length > 0) {
      return res.status(200).json({
        success: false,
        message: "이미 존재하는 이메일 아이디입니다",
      });
    }
    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10); //매개변수 10은 "cost factor" 또는 "work factor"라고 불리며, 해싱 알고리즘의 반복 횟수를 결정
    const hash = await bcrypt.hash(userPassword, salt);
    userPassword = hash;

    // 회원정보 DB에 저장
    const registerSql =
      "INSERT INTO user (user_id, user_pw, user_name, user_email, user_phone, address, address_detail, zone_code) values(?,?,?,?,?,?,?,?)";
    await new Promise((resolve, reject) => {
      connection.query(
        registerSql,
        [
          userId,
          userPassword,
          userName,
          userEmail,
          userPhone,
          address,
          detailAddress,
          zonecode,
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // 회원가입이 성공한 경우 클라이언트에게 응답을 보낸다
    console.log("사용자가 성공적으로 등록");
    return res.status(200).json({
      success: true,
      message: "회원가입이 등록되었습니다",
    });
  } catch (err) {
    console.error("서버에서 오류 발생 : ", err);
    return res.status(500).json({
      success: false,
      message: "회원가입 중 오류가 발생하였습니다",
      error: err.message,
    });
  }
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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // 토큰이 없으면 인증 실패

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // 유효하지 않은 토큰

    req.user = user; // 사용자 정보를 req.user에 저장
    next();
  });
};

/*=================   검색   =====================*/
// 검색어 삽입 및 상품 조회
app.post("/search", authenticateToken, (req, res) => {
  const { term } = req.body;
  if (!term) {
    return res.status(400).send("Search term is required");
  }

  const userId = req.user.userId; // 사용자 ID 가져오기

  const insertQuery =
    "INSERT INTO search (user_id, key_word, search_date) VALUES (?, ?, NOW())";
  console.log(
    `Executing query: ${insertQuery} with values: [${userId}, ${term}]`
  );
  connection.query(insertQuery, [userId, term], (err, results) => {
    if (err) {
      console.error("검색어 삽입 오류:", err);
      return res.status(500).send(err.message);
    }

    const searchQuery =
      "SELECT product_id, category_id, sub_category_id, p_name, p_description, p_price, main_image FROM product WHERE p_name LIKE ?";
    console.log(`Executing query: ${searchQuery} with value: ${term}`);
    connection.query(searchQuery, [`%${term}%`], (err, productResults) => {
      if (err) {
        console.error("상품 조회 오류:", err);
        return res.status(500).send(err.message);
      }

      if (productResults.length === 0) {
        return res.status(404).send("Product not found");
      }

      res.status(201).send(productResults);
    });
  });
});

// 검색 기록 조회
app.get("/search", (req, res) => {
  const query = "SELECT * FROM search ORDER BY search_date DESC LIMIT 10";
  console.log(`Executing query: ${query}`);
  connection.query(query, (err, results) => {
    if (err) {
      console.error("검색 기록중 오류발생:", err);
      return res.status(500).send(err.message);
    }
    res.status(200).send(results);
  });
});

// 기록 삭제
app.delete("/search", (req, res) => {
  const deleteQuery = "DELETE FROM search";
  const resetAutoDeleteQuery = "ALTER TABLE search AUTO_INCREMENT = 1";

  console.log(`Executing query: ${deleteQuery}`);
  connection.query(deleteQuery, (err, results) => {
    if (err) {
      console.error("모든 검색어 삭제 오류:", err);
      return res.status(500).send(err.message);
    }

    console.log(`Executing query: ${resetAutoDeleteQuery}`);
    connection.query(resetAutoDeleteQuery, (err, results) => {
      if (err) {
        console.error("재설정 오류 :", err);
        return res.status(500).send(err.message);
      }
      res.status(200).send("모든 검색 삭제 하였습니다");
    });
  });
});

// 주문 처리 API 엔드포인트
app.post("/reqOrder", (req, res, next) => {
  const { orderSheet, paymentPersonDB } = req.body;

  // 주문 정보 삽입 쿼리
  const insertOrderQuery =
    "INSERT INTO `order` (order_number, user_id, product_id, order_date, order_name, order_phone, order_addr, order_addr_detail, order_count, total_amount, main_image, payment, total_count, p_name) VALUES ?";

  // 새로운 배열 생성
  const newOrderSheet = orderSheet.map((order) => ({
    ...order,
    ...paymentPersonDB,
  }));

  //  console.log("===============newOrderSheet=================");
  //  console.log(newOrderSheet);
  //  console.log("================================");

  // order_number, user_id, product_id, order_date, order_name, order_phone, order_addr, order_addr_detail, order_count, total_amount, main_image, payment, total_count, p_name
  // Promise 배열 생성
  const queryPromises = newOrderSheet.map((article) => {
    const data = [
      article.order_number,
      article.user_id,
      article.product_id,
      article.order_date,
      article.name,
      article.phone,
      article.address,
      article.detailAddress,
      article.quantity,
      article.orderAmount,
      article.email,
      article.total_amount,
      article.total_count,
      article.p_name,
    ];

    // connection.query 메서드를 사용한 프로미스 반환
    return new Promise((resolve, reject) => {
      connection.query(insertOrderQuery, [[data]], (err, result) => {
        if (err) {
          reject(err);
          console.log("insertOrderQuery  ::  " + err);
        } else {
          resolve(result);
          console.log("insertOrderQuery  ::  " + result);
        }
      });
    });
  });

  // 모든 쿼리가 성공적으로 실행될 때까지 기다린 후 응답
  Promise.all(queryPromises)
    .then(() => {
      res.status(200).send("주문이 성공적으로 처리되었습니다.");
    })
    .catch((error) => {
      console.error("주문 처리 중 오류 발생:", error);
      next(error);
    });
});
/*=================   로그인   =====================*/
app.post("/api/login", async (req, res) => {
  let { userId, userPassword } = req.body; // 클라이언트에서 받은 로그인정보
  try {
    // 전달받은 아이디로 아이디와 비밀번호, 유저이름 찾기
    const findIdSql =
      "SELECT user_id,user_pw,user_name FROM user WHERE user_id = ?";

    const findUserResult = await new Promise((resolve, reject) => {
      connection.query(findIdSql, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    // 일치하는 아이디가 없다면 클라이언트에 에러메세지 전달
    if (findUserResult.length === 0) {
      return res.status(401).json({
        success: false,
        message: "all wrong",
      });
    }

    // 일치하는 아이디가 있다면 쿼리문의 결과값에서 유저 비밀번호 추출
    const dbPassword = findUserResult[0].user_pw;

    // 사용자가 입력한 비밀번호와 일치하는지 체크 (입력한 비밀번호, DB에 저장된 비밀번호)
    const isMatch = await bcrypt.compare(userPassword, dbPassword);
    if (!isMatch) {
      // 입력한 비밀번호가 틀리다면
      return res.status(401).json({
        sucess: false,
        message: "wrong password",
      });
    } else {
      // 입력한 비밀번호가 맞다면 토큰을 생성
      const payload = { userId: findUserResult[0].user_id };
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);

      const verified = jwt.verify(accessToken, JWT_SECRET); // { userId: 'star1234', iat: 1719076826, exp: 1719080426 }
      const tokenIat = verified.iat;
      const tokenExp = verified.exp;
      let decodedExp = verified.exp - verified.iat; // 생성 - 만료 = 유효시간

      // 쿠키에 refresh토큰을 저장하고, 클라이언트에게 JSON 응답 반환
      console.log({
        success: true,
        message: "로그인 성공",
        token: decodedExp,
      });
      // refreshToken을 서버의 쿠키에 저장
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false, // HTTPS를 사용할 경우 true로 변경
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
        sameSite: "strict", // 적절한 SameSite 설정을 적용하세요
      });

      return res.status(200).header("authorization", accessToken).json({
        success: true,
        message: "로그인 성공",
        tokenExp: tokenExp,
        tokenIat: tokenIat,
        userId: findUserResult[0].user_id,
        userName: findUserResult[0].user_name,
      });
    }
  } catch (err) {
    console.error("서버에서 오류 발생 : ", err);
    return res.status(500).json({
      success: false,
      message: "로그인 중 오류가 발생하였습니다",
      error: err.message,
    });
  }
});
/*=================   토큰 검증   =====================*/
app.get("/api/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  // Bearer이 붙어있어서 띄어쓰기로 토큰을 구분한다
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    // 로그인페이지로 이동하기
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, userID) => {
    if (err) {
      // 로그인페이지로 이동하기
      return res.status(403).json({ message: "토큰 확인 실패" });
    }
    return res.status(200).json({ valid: true, userId: userID });
  });
});
/*=================   refreshToken으로 accessToken 재발급   =====================*/
app.get("/api/refresh-token", (req, res) => {
  const refreshToken = req.cookies["refreshToken"];

  if (!refreshToken) {
    console.log("refresh토큰 없음");
    // 사용자를 로그인페이지로 이동시키기
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const newAccessToken = generateAccessToken({ userId: decoded.userId });
    return res.status(200).json({ newToken: newAccessToken });
  } catch (error) {
    // 토큰 검증 실패
    if (error.name === "TokenExpiredError") {
      console.log("토큰 만료");
      return res.status(403).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      console.log("유효하지 않은 토큰");
      return res.status(403).json({ message: "Invalid token" });
    } else {
      console.log("기타 에러 발생:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
});
/*=================   회원정보 가져오기   =====================*/
app.get("/api/userInfo", async (req, res) => {
  const userId = req.headers.user_id;
  try {
    const userInfoSql = "SELECT * FROM user WHERE user_id = ?";
    const userInfo = await new Promise((resolve, reject) => {
      connection.query(userInfoSql, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    if (userInfo.length > 0) {
      return res.status(200).json({
        success: true,
        data: userInfo,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "회원정보를 찾을 수 없습니다",
      });
    }
  } catch (err) {
    console.error("서버에서 오류 발생 : ", err);
    return res.status(500).json({
      success: false,
      message: "회원정보 조회 중 오류 발생",
      error: err.message,
    });
  }
});
/*=================   회원정보 수정   =====================*/
app.post("/api/updateUser", async (req, res) => {
  console.log(req.body);
  let {
    userId,
    userPassword,
    userName,
    userPhone,
    userEmail,
    zonecode,
    address,
    detailAddress,
  } = req.body;

  try {
    // 이메일 저장 전 중복 체크
    const checkEmailSql =
      "SELECT COUNT(*) AS count FROM user WHERE user_email = ? AND user_id != ?";
    const emailResult = await new Promise((resolve, reject) => {
      connection.query(checkEmailSql, [userEmail, userId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          if (result.length > 0 && result[0].count !== 0) {
            // 중복된 이메일이 존재할 경우
            return res.status(401).json({
              success: false,
              message: "duplicate email",
            });
          } else {
            // 중복된 이메일이 없는 경우, 여기서는 resolve를 호출하여 다음 작업을 진행합니다.
            resolve(result);
          }
        }
      });
    });

    // 비밀번호 암호화
    if (userPassword !== "") {
      // 새로운 비밀번호를 입력한 경우
      const salt = await bcrypt.genSalt(10); //매개변수 10은 "cost factor" 또는 "work factor"라고 불리며, 해싱 알고리즘의 반복 횟수를 결정
      const hash = await bcrypt.hash(userPassword, salt);
      userPassword = hash;
      // 회원정보 DB에 저장
      const updateUserSql =
        "UPDATE user SET user_pw = ?, user_email = ?, user_phone = ?, address = ?, address_detail = ?, zone_code = ? WHERE user_id = ?";
      await new Promise((resolve, reject) => {
        connection.query(
          updateUserSql,
          [
            userPassword,
            userEmail,
            userPhone,
            address,
            detailAddress,
            zonecode,
            userId,
          ],
          (err, result) => {
            if (err) {
              reject(err);
              console.error("쿼리 실행 중 오류 발생:", err);
            } else {
              resolve(result);
            }
          }
        );
      });
    } else {
      // 새로운 비밀번호를 입력하지않은 경우
      // 회원정보 DB에 저장
      const updateUserSql =
        "UPDATE user SET user_email = ?, user_phone = ?, address = ?, address_detail = ?, zone_code = ? WHERE user_id = ?";
      await new Promise((resolve, reject) => {
        connection.query(
          updateUserSql,
          [userEmail, userPhone, address, detailAddress, zonecode, userId],
          (err, result) => {
            if (err) {
              reject(err);
              console.error("쿼리 실행 중 오류 발생:", err);
            } else {
              resolve(result);
            }
          }
        );
      });
    }
    // 성공 응답
    return res.status(200).json({
      success: true,
      message: "회원정보가 성공적으로 수정되었습니다",
    });
  } catch (err) {
    console.error("서버에서 오류 발생 : ", err);
    return res.status(500).json({
      success: false,
      message: "회원정보 수정중 오류가 발생하였습니다",
      error: err.message,
    });
  }
});
/*==========================================================*/
app.listen(port, () => console.log(`${port}번으로 서버 실행`));

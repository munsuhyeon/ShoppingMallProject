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

dotenv.config();
const port = 8000;
app.use(
  cors({
    origin: `${process.env.CLIENT_URL}`, // origin 옵션은 허용할 출처(도메인)를 지정
    credentials: true, // credentials: true는 자격 증명(쿠키, 인증 헤더 등)을 포함한 요청을 허용할지 여부를 지정
    exposedHeaders: ["Authorization"],
  })
);
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
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
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
    userType
  } = req.body;

  try {
    // 아이디 중복체크와 이메일 중복체크가 동시에 일어나지 않도록 promise 사용
    // DB에 저장 전 id  중복체크
    const checkIdSql = "SELECT user_id FROM user WHERE user_id = ? AND user_type = ?";
    const idResult = await new Promise((resolve, reject) => {
      connection.query(checkIdSql, [userId,userType], (err, result) => {
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
    const checkEmailSql = "SELECT user_email FROM user where user_email = ? AND user_type = ?";
    const emailResult = await new Promise((resolve, reject) => {
      connection.query(checkEmailSql, [userEmail,userType], (err, result) => {
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
      "INSERT INTO user (user_id, user_pw, user_name, user_email, user_phone, address, address_detail, zone_code, user_type) values(?,?,?,?,?,?,?,?,?)";
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
          userType
        ],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    // 회원가입이 성공한 경우 클라이언트에게 응답을 보낸다
    //console.log("사용자가 성공적으로 등록");
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
/*=================   검색 수정.ver   =====================*/
// 입력한 검색어를 DB에서 조회하는 기능
app.get("/api/search", async (req, res) => {
  const term = req.query.term;
  try {
    const searchSql = "SELECT * FROM product WHERE p_name LIKE ?";
    const searchTerm = "%" + term + "%";
    const searchResult = await new Promise((resolve, reject) => {
      connection.query(searchSql, [searchTerm], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
    if (searchResult.length > 0) {
      return res.status(200).json({ result: searchResult });
    } else {
      return res.status(404).json({ result: "Product not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버에서 오류 발생" });
  }
});
// 로그인한 유저가 입력한 검색어 DB에 저장하는 기능
app.post("/api/search", async (req, res) => {
  const userId = req.body.userId;
  const searchTerm = req.body.searchTerm;

  try {
    const updateSearchSql =
      "INSERT INTO search (user_id, key_word) VALUES (?, ?)";
    const updateResult = await new Promise((resolve, reject) => {
      connection.query(updateSearchSql, [userId, searchTerm], (err, result) => {
        if (err) {
          reject(err);
          //console.error(err);
        } else {
          resolve(result);
          //console.log(result);
        }
      });
    });

    if (updateResult.affectedRows > 0) {
      return res
        .status(200)
        .json({ message: "Search log updated successfully" });
    } else {
      return res.status(500).json({ error: "Failed to update search log" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버에서 오류 발생" });
  }
});
// 유저의 검색기록 가져오기
app.get("/api/allSearch", async (req, res) => {
  const userId = req.query.userId;
  try {
    allSearchSql = "SELECT * FROM search WHERE user_id = ?";
    const allSearchResult = await new Promise((resolve, reject) => {
      connection.query(allSearchSql, [userId], (err, result) => {
        if (err) {
          reject(err);
          //console.error(err);
        } else {
          resolve(result);
          //console.log(result);
        }
      });
    });
    return res.status(200).json({ result: allSearchResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "서버에서 오류 발생" });
  }
});
// 전체 검색기록 삭제
app.delete("/api/allSearch", async (req, res) => {
  const userId = req.query.userId;
  const deleteSearchSql = "DELETE FROM search WHERE user_id = ?";

  try {
    const deleteResult = await new Promise((resolve, reject) => {
      connection.query(deleteSearchSql, [userId], (err, result) => {
        if (err) {
          res.status(500).json({ error: "검색기록 삭제 중 오류 발생" });
          return reject(err);
        }
        resolve(result);
      });
    });
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.error("검색기록 삭제 중 오류 발생:", error);
  }
});
// 선택한 검색기록 삭제
app.delete("/api/search", async (req, res) => {
  const userId = req.query.userId;
  const seasrchId = req.query.searchId;
  const deleteSql = "DELETE FROM search WHERE user_id = ? AND search_id = ?";
  try {
    await new Promise((resolve, reject) => {
      connection.query(deleteSql, [userId, seasrchId], (err, result) => {
        if (err) {
          console.error("검색기록 삭제 중 오류 발생:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
    res.status(200).json({ message: "success" });
  } catch (error) {
    // 오류 발생 시 콘솔에 로그 남기고 클라이언트에 500 에러 응답
    console.error("검색기록 삭제 중 오류 발생:", error);
    res.status(500).json({ error: "서버 오류 발생" });
  }
});
/*=================   주문   =====================*/
// 주문 처리 API 엔드포인트
app.post("/reqOrder", (req, res, next) => {
  const { orderSheet, paymentPersonDB } = req.body;

  // 주문 정보 삽입 쿼리
  const insertOrderQuery =
    "INSERT INTO `order` (order_number, user_id, product_id, order_date, order_name, order_phone, order_addr, order_addr_detail, order_count, total_amount, user_email, main_image, payment, total_count, p_name) VALUES ?";
  // 새로운 배열 생성
  const newOrderSheet = orderSheet.map((order) => ({
    ...order,
    ...paymentPersonDB,
  }));

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
      article.main_image,
      article.total_amount,
      article.total_count,
      article.p_name,
    ];

    // connection.query 메서드를 사용한 프로미스 반환
    return new Promise((resolve, reject) => {
      connection.query(insertOrderQuery, [[data]], (err, result) => {
        if (err) {
          reject(err);
          //console.log("insertOrderQuery  ::  " + err);
        } else {
          resolve(result);
          //console.log("insertOrderQuery  ::  " + result);
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
/*=================   구매내역   =====================*/
// 주문 데이터를 가져오는 API 엔드포인트
app.get("/api/orders", async (req, res) => {
  const months = parseInt(req.query.months, 10);
  const userId = req.query.userId;
  let sqlQuery;
  let queryParams = [];

  if (months === 0) {
    sqlQuery = `
      SELECT order_id, order_number, main_image, p_name, order_count, total_amount, order_date, user_id, product_id, review_yn
      FROM bluewave.order
      WHERE user_id = ? AND DATE(order_date) = CURDATE() ORDER BY order_date DESC
    `;
  } else {
    sqlQuery = `
      SELECT order_id, order_number, main_image, p_name, order_count, total_amount, order_date, user_id, product_id, review_yn
      FROM bluewave.order
      WHERE user_id = ? AND order_date >= DATE_SUB(NOW(), INTERVAL ? MONTH) ORDER BY order_date DESC
    `;
    queryParams = [months];
  }

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sqlQuery, [userId, queryParams], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error fetching orders");
  }
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
      /*console.log({
        success: true,
        message: "로그인 성공",
        token: decodedExp,
      });*/
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
    console.log("accessToken이 없습니다");
    return res.json({ valid: false,message: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, userID) => {
    if (err) {
      // 로그인페이지로 이동하기
      console.log("유효하지 않은 accessToken");
      return res.json({ valid: false,message: "토큰 확인 실패" });
    }
    console.log("accessToken 검증 성공");
    return res.json({ valid: true, userId: userID });
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

    const verified = jwt.verify(newAccessToken, JWT_SECRET);
    const decodedExp = verified.exp - verified.iat;
    console.log("토큰 재발급 성공");
    return res
      .status(200)
      .json({ newToken: newAccessToken, tokenExp: decodedExp });
  } catch (error) {
    // 토큰 검증 실패
    console.log("토큰 재발급 실패");
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
  const userId = req.query.user_id;

  try {
    const userInfoSql = "SELECT * FROM user WHERE user_id = ?";
    const userInfo = await new Promise((resolve, reject) => {
      connection.query(userInfoSql, [userId], (err, result) => {
        if (err) {
          reject(err);
          //console.log(err)
        } else resolve(result);
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
/*=========================리뷰 작성=================================*/
app.post("/text", async (req, res) => {
  try {
    let { user_id, product_id, order_id, title, contents, star_rating } =
      req.body;

    const insertQuery =
      "INSERT INTO review ( user_id,product_id,order_id,title, contents, star_rating) VALUES ( ?, ?, ?, ?, ?, ?)";
    await new Promise((resolve, reject) => {
      connection.query(
        insertQuery,
        [user_id, product_id, order_id, title, contents, star_rating],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    const orderReviewSql =
      "UPDATE bluewave.order SET review_yn = 'Y' WHERE user_id = ? AND product_id = ? AND order_id = ?";
    await new Promise((resolve, reject) => {
      connection.query(
        orderReviewSql,
        [user_id, product_id, order_id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });
    return res.json({ success: true, message: "리뷰가 등록되었습니다" });
  } catch (error) {
    console.error("서버에서 오류 발생 : ", error);
    return res.status(500).json({
      success: false,
      message: "리뷰등록 중 오류가 발생하였습니다",
      error: error.message,
    });
  }
});

app.get("/api/reviews", async (req, res) => {
  //const months = parseInt(req.query.months, 10);
  const userId = req.query.userId;
  let sqlQuery;
  //let queryParams = [];

  sqlQuery = `
      SELECT r.review_id, r.user_id, r.product_id, r.order_id, r.contents, r.review_date, r.star_rating, p.main_image,p_name,title
      FROM review r
      JOIN product p ON r.product_id = p.product_id
      WHERE user_id = ? ORDER BY review_date DESC `;

  try {
    const results = await new Promise((resolve, reject) => {
      connection.query(sqlQuery, userId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
          //console.log(results)
        }
      });
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).send("Error fetching reviews");
  }
});
/*=================   비밀번호 찾기   =====================*/
app.get("/api/findPassword", async (req, res) => {
  const userId = req.query.userId;
  const userEmail = req.query.userEmail;
  try {
    const findEmailSql = "SELECT user_email FROM user WHERE user_email = ?";
    const findUserEmail = await new Promise((resolve, reject) => {
      connection.query(findEmailSql, [userEmail], (err, result) => {
        if (err) {
          reject(err); //err: 데이터베이스 쿼리 중 발생한 오류를 나타내는 객체입니다. 오류가 발생하지 않으면 null입니다.
        } else {
          resolve(result); // result: 데이터베이스 쿼리의 결과를 나타내는 객체나 배열
        }
      });
    });

    if (findUserEmail && findUserEmail.length > 0) {
      const findIdSql =
        "SELECT user_id FROM user WHERE user_id = ? AND user_email = ?";
      const findUserId = await new Promise((resolve, reject) => {
        connection.query(findIdSql, [userId, userEmail], (err, result) => {
          if (err) {
            reject(err); //err: 데이터베이스 쿼리 중 발생한 오류를 나타내는 객체입니다. 오류가 발생하지 않으면 null입니다.
          } else {
            resolve(result); // result: 데이터베이스 쿼리의 결과를 나타내는 객체나 배열
          }
        });
      });
      // 사용자 아이디 검색 결과를 확인합니다.
      if (findUserId && findUserId.length > 0) {
        // 사용자 아이디와 이메일 모두 존재하는 경우 성공적인 응답을 클라이언트에게 전송합니다.
        return res.status(200).json({ success: true });
      } else {
        // 사용자 아이디가 존재하지 않는 경우 에러 응답을 클라이언트에게 전송합니다.
        return res.status(200).json({ success: false, message: "wrong id" });
      }
    } else {
      // 사용자 이메일이 존재하지 않는 경우 에러 응답을 클라이언트에게 전송합니다.
      return res.status(200).json({ success: false, message: "wrong email" });
    }
  } catch (error) {
    // 비동기 작업 중 발생한 모든 오류에 대한 일반적인 처리
    console.error("Database query failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
});
/*=================   비밀번호 재설정   =====================*/
app.post("/api/resetPassword", async (req, res) => {
  let { userPassword, userId } = req.body;
  try {
    // 비밀번호 암호화
    const salt = await bcrypt.genSalt(10); //매개변수 10은 "cost factor" 또는 "work factor"라고 불리며, 해싱 알고리즘의 반복 횟수를 결정
    const hash = await bcrypt.hash(userPassword, salt);
    userPassword = hash;
    const resetPwSql = "UPDATE user SET user_pw = ? WHERE user_id = ?";
    const resetPassword = await new Promise((resolve, reject) => {
      connection.query(resetPwSql, [userPassword, userId], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Database query failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
});
/*=================   아이디 찾기   =====================*/
app.get("/api/findId", async (req, res) => {
  const userName = req.query.userName;
  const userEmail = req.query.userEmail;
  try {
    const findEmailSql = "SELECT user_email FROM user WHERE user_email = ?";
    const findUserEmail = await new Promise((resolve, reject) => {
      connection.query(findEmailSql, [userEmail], (err, result) => {
        if (err) {
          reject(err); //err: 데이터베이스 쿼리 중 발생한 오류를 나타내는 객체입니다. 오류가 발생하지 않으면 null입니다.
        } else {
          resolve(result); // result: 데이터베이스 쿼리의 결과를 나타내는 객체나 배열
        }
      });
    });

    if (findUserEmail && findUserEmail.length > 0) {
      const findIdSql =
        "SELECT user_id FROM user WHERE user_name = ? AND user_email = ?";
      const findUserId = await new Promise((resolve, reject) => {
        connection.query(findIdSql, [userName, userEmail], (err, result) => {
          if (err) {
            reject(err); //err: 데이터베이스 쿼리 중 발생한 오류를 나타내는 객체입니다. 오류가 발생하지 않으면 null입니다.
          } else {
            resolve(result); // result: 데이터베이스 쿼리의 결과를 나타내는 객체나 배열
          }
        });
      });
      // 사용자 아이디 검색 결과를 확인합니다.
      if (findUserId && findUserId.length > 0) {
        // 사용자 아이디와 이메일 모두 존재하는 경우 성공적인 응답을 클라이언트에게 전송합니다.
        return res.status(200).json({ success: true, data: findUserId[0] });
      } else {
        // 사용자 이름이 존재하지 않는 경우 에러 응답을 클라이언트에게 전송합니다.
        return res.status(200).json({ success: false, message: "wrong name" });
      }
    } else {
      // 사용자 이메일이 존재하지 않는 경우 에러 응답을 클라이언트에게 전송합니다.
      return res.status(200).json({ success: false, message: "wrong email" });
    }
  } catch (error) {
    // 비동기 작업 중 발생한 모든 오류에 대한 일반적인 처리
    console.error("Database query failed:", error);
    return res
      .status(500)
      .json({ success: false, message: "서버 오류가 발생했습니다" });
  }
});
/*=================   제품별 리뷰 가져오기   =====================*/
app.get("/review/:categoryId/:subCategoryId/:id", (req, res) => {
  const productId = req.params.id;
  const sqlQuery =
    "SELECT * FROM bluewave.review WHERE product_id = ? ORDER BY review_date DESC";

  connection.query(sqlQuery, [productId], (err, result) => {
    if (err) {
      res.status(500).send("리뷰목록을 가져오는 중 에러가 발생하였습니다");
      return;
    }
    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(200).json({ message: "no review" });
    }
  });
});
/*=================   카카오 로그인  - 발급받은 토큰으로 사용자 정보 조회   =====================*/
app.post("/api/getKakaoUser", async (req,res) => {
  const data = req.headers.data;
  const parsedData = JSON.parse(data);
  const ACCESS_TOKEN = parsedData.access_token
  
  try{
    const response = await axios.post("https://kapi.kakao.com/v2/user/me",
      'property_keys=["kakao_account.email"]',
      {
      headers :{
        "Content-Type" : "application/x-www-form-urlencoded",
        "Authorization" : ` Bearer ${ACCESS_TOKEN}`
      }
    });
    const getEmail = response.data.kakao_account.email;
    const query = "SELECT * FROM user WHERE user_email = ? AND user_type = 'K'"
    connection.query(query,getEmail,(err, result) => {
      if (err) {
        return res.status(500).json({message : err});
      }
      if (result.length > 0) {
        const accessToken = generateAccessToken({ userId: result[0].user_id });
        const verified = jwt.verify(accessToken, JWT_SECRET);
        const decodedExp = verified.exp;
        return res
          .status(200)
          .json({ message:"active user", accessToken: accessToken, tokenExp: decodedExp,userInfo:result[0] });
      } else{
        return res.status(200).json({message:"no user",userEmail:getEmail})
      }
    })
  }catch(error){
    console.log(error)
    return res.status(500).json({message:error})
  }
});
/*==========================================================*/

app.listen(port, () => console.log(`${port}번으로 서버 실행`));

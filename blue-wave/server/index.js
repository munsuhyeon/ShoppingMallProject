const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");
const port = 8000;
const bcrypt = require("bcrypt");
const { reject } = require("assert");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
dotenv.config();
// 정적 파일을 제공하기 위해 디렉토리를 설정합니다.
app.use("/img", express.static(path.join(__dirname, "img")));

app.use(express.static(path.join(__dirname + "/images")));
app.use(express.static(path.join(__dirname, "/images/도서")));
app.use(express.static(path.join(__dirname, "/images/스포츠")));
app.use(express.static(path.join(__dirname, "/images/사무용품")));
app.use(express.static(path.join(__dirname, "/images/반려동물용품")));
app.use(express.static(path.join(__dirname, "/images/인테리어")));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

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
app.post("/register", async (req, res) => {
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
  console.log("서버 :::   ", req.body);

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
    console.log("비밀번호 암호화 :::   ", userPassword);
    // 회원정보 DB에 저장
    const registerSql =
      "INSERT INTO user (user_id, user_pw, user_name, user_email, user_phone, address, address_detail) values(?,?,?,?,?,?,?)";
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

/*=================   검색   =====================*/
// 검색어 삽입 및 상품 조회
app.post('/search', (req, res) => {
  const { term } = req.body;
  if (!term) {
      return res.status(400).send('Search term is required');
  }

  const insertQuery = 'INSERT INTO search (user_id, key_word, search_date) VALUES (?, ?, NOW())';
  console.log(`Executing query: ${insertQuery} with values: [1, ${term}]`);
  connection.query(insertQuery, [1, term], (err, results) => {
      if (err) {
          console.error('검색어 삽입 오류:', err);
          return res.status(500).send(err.message);
      }

      const searchQuery = 'SELECT product_id, category_id, sub_category_id, p_name, p_description, p_price, main_image FROM product WHERE p_name LIKE ?';
      console.log(`Executing query: ${searchQuery} with value: ${term}`);
      connection.query(searchQuery, [`%${term}%`], (err, productResults) => {
          if (err) {
              console.error('상품 조회 오류:', err);
              return res.status(500).send(err.message);
          }

          if (productResults.length === 0) {
              return res.status(404).send('Product not found');
          }

          res.status(201).send(productResults);
      });
  });
});

// 검색 기록 조회
app.get('/search', (req, res) => {
  const query = 'SELECT * FROM search ORDER BY search_date DESC LIMIT 10';
  console.log(`Executing query: ${query}`);
  connection.query(query, (err, results) => {
      if (err) {
          console.error('검색 기록중 오류발생:', err);
          return res.status(500).send(err.message);
      }
      res.status(200).send(results);
  });
});

// 기록 삭제
app.delete('/search', (req, res) => {
  const deleteQuery = 'DELETE FROM search';
  const resetAutoDeleteQuery = 'ALTER TABLE search AUTO_INCREMENT = 1';
  
  console.log(`Executing query: ${deleteQuery}`);
  connection.query(deleteQuery, (err, results) => {
      if (err) {
          console.error('모든 검색어 삭제 오류:', err);
          return res.status(500).send(err.message);
      }

      console.log(`Executing query: ${resetAutoDeleteQuery}`);
      connection.query(resetAutoDeleteQuery, (err, results) => {
          if (err) {
              console.error('재설정 오류 :', err);
              return res.status(500).send(err.message);
          }
          res.status(200).send('모든 검색 삭제 하였습니다');
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
  const newOrderSheet = orderSheet.map(order => ({
    ...order,
    ...paymentPersonDB
  }));

  console.log("===============newOrderSheet=================");
  console.log(newOrderSheet);
  console.log("================================");

  // order_number, user_id, product_id, order_date, order_name, order_phone, order_addr, order_addr_detail, order_count, total_amount, main_image, payment, total_count, p_name
  // Promise 배열 생성
  const queryPromises = newOrderSheet.map(article => {
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
      article.name
    ];

    // connection.query 메서드를 사용한 프로미스 반환
    return new Promise((resolve, reject) => {
      connection.query(insertOrderQuery, [[data]], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  // 모든 쿼리가 성공적으로 실행될 때까지 기다린 후 응답
  Promise.all(queryPromises)
    .then(() => {
      res.status(200).send("주문이 성공적으로 처리되었습니다.");
    })
    .catch(error => {
      console.error("주문 처리 중 오류 발생:", error);
      next(error);
    });
});


// 포트 리스닝
app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 실행되었습니다.`);
});





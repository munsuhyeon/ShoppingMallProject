// 필요한 패키지를 불러옵니다.
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const mysqlPromise = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

// Express 애플리케이션을 생성합니다.
const app = express();
const port = 8000;

// 환경변수 설정 파일을 불러옵니다.
dotenv.config();

// URL 인코딩된 데이터를 해석하는 미들웨어를 설정합니다.
app.use(express.urlencoded({ extended: false }));
// JSON 데이터를 해석하는 미들웨어를 설정합니다.
app.use(express.json());

// CORS 설정을 추가합니다. 클라이언트 측 URL을 허용합니다.
app.use(cors());

// 정적 파일을 제공하기 위해 디렉토리를 설정합니다.
app.use("/img", express.static(path.join(__dirname, "img")));

// 환경변수에서 데이터베이스 연결 정보를 가져옵니다.
const { DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE, DB_PORT } = process.env;

// 프로미스를 지원하는 데이터베이스 연결 풀을 생성합니다.
const PromiseConnection = mysqlPromise.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
});

// MySQL 연결
PromiseConnection.getConnection()
  .then((connection) => {
    console.log("Connected to MySQL as id " + connection.threadId);
    connection.release();
  })
  .catch((err) => console.error("MySQL 접속에러: " + err.stack));

// 주문 처리 API 엔드포인트
app.post("/reqOrder", async (req, res, next) => {
  try {
    const { orderSheet, paymentPersonDB } = req.body;
    
    // 주문 정보 삽입 쿼리
    const insertOrderQuery =
      "INSERT INTO `order` (order_number, user_id, product_id, order_date, order_name, order_phone, order_addr, order_addr_detail, order_count, total_amount, main_image, payment, total_count, p_name) VALUES ?";
      // 새로운 배열 생성
      const newOrderSheet = orderSheet.map(order => ({
        ...order,
        ...paymentPersonDB
      }));
      console.log("===============newOrderSheet=================")
      console.log(newOrderSheet);
      console.log("================================")

    await Promise.all(
      newOrderSheet.map(async (article) => {
        const data = [
          article.order_number,
          article.user_id,
          article.product_id,
          article.order_date ,
          article.name,
          article.phone ,
          article.address,
          article.detailAddress,
          article.quantity,
          article.orderAmount,
          article.email ,
          article.total_amount ,
          article.total_count ,
          article.p_name
        ];
        await PromiseConnection.query(insertOrderQuery, [[data]]);
      })
    );
    console.log('아망했다.');

    res.status(200).send("주문이 성공적으로 처리되었습니다.");
  } catch (error) {
    console.error("주문 처리 중 오류 발생:", error);
    next(error);
  }
});


// 포트 리스닝
app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 실행되었습니다.`);
});





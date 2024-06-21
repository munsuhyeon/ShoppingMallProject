import "./App.css";
import Register from "./View/Register";
import Login from "./View/Login";
import Main from "./View/Main";
import AllProduct from "./View/AllProduct.js";
import ProductDetail from "./View/ProductDetail.js";
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from './View/Cart.jsx';
import Payment from './View/Payment.jsx';
import Paymentcomplete from './Components/View/Paymentcomplete';
import Product from './View/Product.jsx';

function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/product/:categoryId/:subCategoryId/:id">
            <ProductDetail />
          </Route>
          <Route path="/product/:categoryId/:subCategoryId">
            <AllProduct />
          </Route>
          <Route path="/product/:categoryid">
            <AllProduct />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        <Route path="/" element={<Product />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/paymentcomplete" element={<Paymentcomplete />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

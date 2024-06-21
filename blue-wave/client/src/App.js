import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from './Components/View/Cart';
import Payment from './Components/View/Payment';
import Paymentcomplete from './Components/View/Paymentcomplete';
import Product from './Components/View/Product';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Product />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/paymentcomplete" element={<Paymentcomplete />} />
      </Routes>
    </Router>
  );
}

export default App;

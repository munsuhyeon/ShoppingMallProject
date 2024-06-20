import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import Register from './View/Register'
import Login from './View/Login'
import Index from './View/Index';
import Review from './View/Review.js'
import OnlyLogin from './View/OnlyLogin.js'
import Header from './View/Header.js';
import CompleteRegister from './View/CompleteRegister';

function App() {

  return (
      <BrowserRouter>
        <div className="App">
          <Header/>
          <Routes>
              <Route path='/' element={<Index/>}/>
              <Route path='/review' element={<Review/>}/>
              {/* 로그인한 사람만 갈 수 있는 페이지 - 장바구니페이지, 결제페이지, 마이페이지 기타 등등*/}
                <Route path='/onlyLogin' element={<OnlyLogin/>}/>
              {/* 로그인하지 않은 사람이 볼 수 있는 페이지*/}
                <Route path='/register' element={<Register/>}/>
                <Route path='/complete_register' element={<CompleteRegister/>}/>
                <Route path='/login' element={<Login/>}/>
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;

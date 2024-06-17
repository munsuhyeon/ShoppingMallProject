import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Register from './View/Register'
import Login from './View/Login'
import Index from './View/Index';
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/' element={<Index/>}/>
        </Routes>
      </div>
    </BrowserRouter>
    
  );
}

export default App;

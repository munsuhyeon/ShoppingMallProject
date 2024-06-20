import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./View/Register";
import Login from "./View/Login";
import Main from "./View/Main";
import AllProduct from "./View/AllProduct.js";
import ProductDetail from "./View/ProductDetail.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
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
        </Switch>
      </div>
    </Router>
  );
}

export default App;

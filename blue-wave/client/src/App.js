import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Register from "./View/Register";
import Login from "./View/Login";
import Index from "./View/Index";
import ProductTest from "./View/ProductTest.js";
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
          <Route path="/ProductTest">
            <ProductTest />
          </Route>
          <Route path="/">
            <Index />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import "./style.css";
import Home from "./pages/Home";
import UserInfo from "./pages/UserInfo";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { SnackbarProvider } from "notistack";

const App = () => (
  <SnackbarProvider>
    <div className="container">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/:login">
            <UserInfo />
          </Route>
        </Switch>
      </Router>
    </div>
  </SnackbarProvider>
);

export default App;

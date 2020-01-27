import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import "assets/scss/material-kit-react.scss?v=1.8.0";
// Pages for this website
import Schedule from "views/Schedule.js";
import LoginPage from "views/LoginPage.js";
import History from "views/History.js";
import BikesAndPrices from "./views/BikesAndPrices";
import Settings from "./views/Settings";

var hist = createBrowserHistory();
let loggedIn = false;

/*
  Index

  This class routes the user to the diferrent pages.
*/

export function setIndexLogin(b) {
  loggedIn = b;
}

ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route
        path="/Bikesandprices"
        render={() => (!loggedIn ? <Redirect to="/" /> : <BikesAndPrices />)}
      />
      <Route
        path="/Schedule"
        render={() => (!loggedIn ? <Redirect to="/" /> : <Schedule />)}
      />
      <Route
        path="/History"
        render={() => (!loggedIn ? <Redirect to="/" /> : <History />)}
      />
      <Route
        path="/Settings"
        render={() => (!loggedIn ? <Redirect to="/" /> : <Settings />)}
      />
      <Route path="/" component={LoginPage} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

import React from "react";
import { Router, Link } from "react-static";
import { hot } from "react-hot-loader";
import Routes from "react-static-routes";

import LanguageSwitcher from "./components/LanguageSwitcher";

import "./app.css";

const App = () => (
  <Router>
    <div>
      <LanguageSwitcher />
      <div>
        <Link to="/">Home</Link>
        <Link to="/why-unionize">Why Unionize?</Link>
      </div>
      <div className="content">
        <Routes />
      </div>
    </div>
    )} />
  </Router>
);

export default hot(module)(App);

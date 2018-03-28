import React from "react";
import { Router, Link } from "react-static";
import { hot } from "react-hot-loader";
import Routes from "react-static-routes";

import LanguageSwitcher from "./components/LanguageSwitcher";

import "./app.css";
import logo from "./images/logo.png";

const App = () => (
  <Router>
    <div className="grid">
      <div className="grid-logo">
        <img src={logo} />
      </div>
      <header className="grid-header">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end"
            }}
          >
            <LanguageSwitcher />
          </div>
          <h1>Sweet header</h1>
        </div>
      </header>
      <aside className="grid-nav">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link to="/">Home</Link>
          <Link to="why-unionize">Why unionize?</Link>
        </div>
      </aside>
      <div className="grid-subhead">
        <h2>cool subheader</h2>
      </div>
      <article className="content">
        <Routes />
      </article>
      <footer className="grid-footer">{/* Footer */}</footer>
    </div>
    )} />
  </Router>
);

export default hot(module)(App);

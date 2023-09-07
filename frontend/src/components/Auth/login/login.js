import React from "react";
import "./login.css";

function login() {
  return (
    <div className="loginPage ">
      <div className="header-login">
        <div className="Logo">
          <img
            src="../logo-variation-plan-de-travail-1-copie-1@2x.png"
            alt="logo"
            className="companyLogo"
          />
        </div>
      </div>
      <hr className="separation" />
      <div className="loginBox">
        <div className="row">
          <div className="col-md-6 side-image">
            <img  src="./rarchitecturet6d96qrb5myunsplash-1@2x.png" alt="" />
          </div>
          <div className="col-md-6 right">
            <div className="inputs-box">
              <h1 className="welcome">WELCOME</h1>
              <h3 className="login-text">Login to your acount</h3>
              <div className="input-field">
                <input
                  type="text"
                  className="input"
                  id="email"
                  required
                />
                <label htmlFor="password">Email or password</label>
              </div>

              <div className="input-field">
                <input
                  type="password"
                  className="input"
                  id="password"
                  required
                />
                <label htmlFor="password">Password</label>
              </div>

              <div className="remember-me">
                {" "}
                <input type="checkbox" className="form-check-input" /> Remember
                me{" "}
              </div>
              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>
              <div className="input-field">
                <input type="submit" className="submit" value="LOGIN" />
              </div>
              <div className="separators">
                <hr className="seperator left" /> OR
                <hr className="seperator right" />
              </div>
              <div className="social-container">
                <a href="#" className="social">
                  <img src="./vector.svg" alt="" size="2x" />
                </a>
                <a href="#" className="social">
                  <img src="./google--original.svg" alt="" size="2x" />
                </a>
                <a href="#" className="social">
                  <img src="./apple--original.svg" alt="" size="2x" />
                </a>
              </div>
              <div className="signup">
                <span>
                  You don't have an account?{" "}
                  <a href="/signup">Join for free today</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default login;

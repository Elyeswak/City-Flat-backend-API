import React from 'react'
import "./signup.css";

function signup() {
  return (
    <div className="signupPage ">
    <div className="header-signup">
      <div className="Logo">
        <img
          src="../logo-variation-plan-de-travail-1-copie-1@2x.png"
          alt="logo"
          className="companyLogo"
        />
      </div>
    </div>
    <hr className="separation" />
    <div className="signupBox">
      <div className="row">
        <div className="col-md-6 side-image">
          <img src="./rarchitecturet6d96qrb5myunsplash-1@2x.png" alt="" />
        </div>
        <div className="col-md-6 right">
          <div className="input-box">
            <h1 className="welcome">WELCOME</h1>
            <h3 className="signin-text">Sign up</h3>

            <div className="input-field">
              <input
                type="text"
                className="input"
                id="email"
                required
              />
              <label htmlFor="password">Your name</label>
            </div>

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
              
              <input type="checkbox" className="form-check-input" /> <span>By creating an account, you agree to our</span>
        <strong className="terms"> terms</strong>
        <span>{` and `}</span>
        <strong className="terms">privacy policy</strong>
            </div>
        
            <div className='signup-button'>
              <input type="submit" className="submit" value="SIGN UP" />
            </div>
            <div className="separators">
              <hr className="seperator left" /> OR
              <hr className="seperator right" />
            </div>
            <div className="social-container">
              <a href="www.facebook.com" className="social">
                <img src="./vector.svg" alt="" size="2x" />
              </a>
              <a href="www.google.com" className="social">
                <img src="./google--original.svg" alt="" size="2x" />
              </a>
              <a href="www.apple.com" className="social">
                <img src="./apple--original.svg" alt="" size="2x" />
              </a>
            </div>
            <div className="login">
              <span>
                You already have an account?
                <a href="/login"> Login to your account</a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default signup
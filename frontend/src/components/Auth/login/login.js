import React, { useEffect, useRef, useState } from "react";
import AuthService from "../../../services/Auth.services";
import "./login.css";


import { useNavigate } from "react-router-dom";


function Login() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate=useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  //make error disappear when the email or password state changes
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    setEmail("");
    setPassword("");

    AuthService.login(email, password).then(
      () => {
        setSuccessMsg(true);
        navigate('/');

      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
      }
    );
  };

  return (
    <>
      
        <div className="loginPage ">
          <main>
            <div className="box">
              <div className="inner-box">
                <div className="forms-wrap">
                  <form
                    autoComplete="off"
                    className="log-in-form"
                    onSubmit={handleSubmit}
                  >
                    <div className="cityflat_logo">
                      <img alt="" src="./logo-cityflat.png" />
                    </div>
                    {/** error message */}
                    <p
                      ref={errRef}
                      className={errMsg ? "errmsg" : "offscreen"}
                      aria-live="assertive"
                    >
                      {errMsg}
                    </p>

                    <div className="heading">
                      <h2>WELCOME</h2>
                      <h4>Login to your account</h4>
                    </div>

                    <div className="actual-form">
                      <div className="input-wrap">
                        <label className="label-form" htmlFor="email">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          ref={userRef}
                          className="input-field"
                          autoComplete="off"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          required
                        />
                      </div>

                      <div className="input-wrap">
                        <label className="label-form" htmlFor="password">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          minLength="4"
                          className="input-field"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          required
                        />
                      </div>
                      <div className="reset__options">
                        <div className="remember-me">
                          {" "}
                          <input
                            type="checkbox"
                            className="form-check-input"
                          />{" "}
                          Remember me{" "}
                        </div>
                        <div className="forgot-password">
                          <a href="/">Forgot password?</a>
                        </div>
                      </div>
                      <button className="sign-btn"> LOGIN </button>
                    </div>
                  </form>
                  <div className="separators">
                    <hr className="seperator left" />{" "}
                    <b style={{ fontFamily: "font-alethia-pro" }}>OR</b>
                    <hr className="seperator right" />
                  </div>

                  <div className="social-container">
                    <a href="#/" className="social">
                      <img src="./vector.svg" alt="" size="2x" />
                    </a>
                    <a href="#/" className="social">
                      <img src="./google--original.svg" alt="" size="2x" />
                    </a>
                    <a href="#/" className="social">
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

                <div className="carousel_login">
                  <div className="">
                    <img
                      alt=""
                      src="./logo-cityflat.png"
                      className="logo_city_flat"
                    />
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
    </>
  );
}

export default Login;

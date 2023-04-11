import React, { useEffect, useRef, useState } from "react";
import AuthService from "../../../services/Auth.services";
import "./login.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

function Login() {
  const errRef = useRef();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [loginForm, setLoginForm] = useState(false);

  /**CHECK FOR PASSWORD VISIBILTY */
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  //make error disappear when the email or password state changes
  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  /**LOGIN METHOD */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmail("");
    setPassword("");

    AuthService.login(email, password).then(
      () => {
        setSuccessMsg(true);
        setIsLoggedin(true);
        toast.success("✅ Welcome to CITYFLAT", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        navigate("/");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(resMessage);
        toast.error("❌ An error occured!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    );
  };

  /**CHECK IF USER LOGGEDIN  */

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogguseedinUser = () => {};

  useEffect(() => {
    if (!user) {
      setLoginForm(true);
      console.log("user is not logged in");
    } else {
      setLoginForm(false);
      console.log("user is logged in");
    }
  }, []);

  return (
    <>
      <div className="loginPage ">
        <main>
          <div className="box">
            <div className="inner-box">
              {loginForm ? (
                <div className="forms-wrap">
                  <form
                    autoComplete="off"
                    className="log-in-form"
                    onSubmit={handleSubmit}
                  >
                    <ToastContainer
                      position="top-right"
                      autoClose={2000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="light"
                    />
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
                          type={passwordVisible ? "text" : "password"}
                          id="password"
                          minLength="4"
                          className="input-field"
                          onChange={(e) => setPassword(e.target.value)}
                          value={password}
                          required
                        />

                        {passwordVisible ? (
                          <FontAwesomeIcon
                            onClick={() => setPasswordVisible(false)}
                            className="eyeIcon"
                            icon={faEye}
                          />
                        ) : (
                          <FontAwesomeIcon
                            onClick={() => setPasswordVisible(true)}
                            className="eyeIcon"
                            icon={faEye}
                          />
                        )}
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
              ) : (
                <div className="go-home-space">
                  <div className="go-home ">
                    <h4>
                      You are already logged in{" "}
                      <a
                        href="/"
                        className="link link--metis"
                        style={{ color: "#bd8f1c" }}
                      >
                        GO HOME
                      </a>
                    </h4>
                  </div>
                </div>
              )}
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

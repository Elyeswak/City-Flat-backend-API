import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmail, isStrongPassword } from "validator";
import AuthService from "../../../services/Auth.services";

import "./signup.css";

function Signup() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const [isChecked, setIsChecked] = useState(false);

  /**CHECK FOR PASSWORD VISIBILTY */
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    AuthService.register(name, email, password).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        navigate("/");
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setMessage(resMessage);
        setSuccessful(false);
      }
    );
  };

  return (
    <div className="signupPage ">
      <main>
        <div className="box">
          <div className="inner-box">
            <div className="forms-wrap">
              <form
                autoComplete="off"
                className="sign__up__form"
                onSubmit={handleRegister}
                ref={userRef}
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
                  <h4>Signup to your account</h4>
                </div>

                <div className="actual-form">
                  <div className="input-wrap">
                    <label className="label-form" htmlFor="name">
                      Your name
                    </label>
                    <input
                      type="text"
                      id="name"
                      minLength="4"
                      onChange={onChangeName}
                      className="input-field"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="input-wrap">
                    <label className="label-form" htmlFor="email">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      minLength="4"
                      onChange={onChangeEmail}
                      className="input-field"
                      autoComplete="off"
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
                      onChange={onChangePassword}
                      className="input-field password_field"
                      autoComplete="off"
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
                    <div>
                      <label className="remember-me-signup">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                        />{" "}
                        By creating an account, you agree to the{" "}
                        <a href="/terms">
                          <strong>terms</strong>
                        </a>{" "}
                        and{" "}
                        <a href="/conditions">
                          <strong>conditions</strong>
                        </a>
                      </label>
                      <button disabled={!isChecked} className="submit-btn">
                        SIGNUP
                      </button>
                    </div>
                  </div>
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
                  You have an account? <a href="/login">Login now</a>
                </span>
              </div>
            </div>

            <div className="carousel_login">
              <div className="">
                <img alt="" src="./logo-cityflat.png" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;

import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isEmail, isStrongPassword } from "validator";
import AuthService from "../../../services/Auth.services";

import "./signup.css";

/*==============Validations==============*/

//email validation check
const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">This is not a valid email.</div>
    );
  }
};

//username validation check
const vname = (value) => {
  if (value.length < 4 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The username must be between 4 and 20 characters.
      </div>
    );
  }
};

//password validation check
const vpassword = (value) => {
  if (!isStrongPassword(value)) {
    return (
      <div className="invalid-feedback d-block">
        <ol>
          <li>The password must have at least 8 characters.</li>
          <li>The password must contain at least 1 lowercase.</li>
          <li>The password must contain at least 1 uppercase.</li>
          <li>The password must contain at least 1 symbole.</li>
          <li>The password must contain at least 1 number.</li>
        </ol>
      </div>
    );
  }
};

/*==============End Validations==============*/

function Signup() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate=useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

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
    AuthService.register(
      name,
      email,
      password,
    ).then(
      (response) => {
        setMessage(response.data.message);
        setSuccessful(true);
        navigate('/');
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
  }
  return (
    <div className="signupPage ">
      <main>
        <div className="box">
          <div className="inner-box">
            <div className="forms-wrap">
              <form
                autoComplete="off"
                className="sign__up__form"
                onSubmit={handleRegister} ref={userRef}
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
                    <label className="label-form" htmlFor="name">Your name</label>
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
                    <label className="label-form" htmlFor="email">Email</label>
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
                    <label className="label-form" htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      minLength="4"
                      onChange={onChangePassword}
                      className="input-field"
                      autoComplete="off"
                      required
                    />
                  </div>
                  <div className="reset__options">
                    <div className="remember-me">
                      {" "}
                      <input type="checkbox" className="form-check-input" />
                      <span> By creating an account, you agree to our</span>
                      <strong className="terms"> terms</strong>
                      <span>{` and `}</span>
                      <strong className="terms">privacy policy</strong>
                    </div>
                  </div>
                  <input type="submit" value="SIGN UP" className="sign-btn" />
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

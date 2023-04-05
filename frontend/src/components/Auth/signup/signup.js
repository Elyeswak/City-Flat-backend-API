import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Swal from "sweetalert2";

import "./signup.css";

function Signup() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState();
  const [verificationCode, setVerificationCode] = useState("");
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
  const onChangeCode = (e) => {
    const code = e.target.value;
    setVerificationCode(code);
  };

  /**REGISTER REQUEST */

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent form submission
    try {
      const response = await axios.post("http://localhost:9090/user/register", {
        name: name,
        email: email,
        password: password,
        number: number,
      });
      console.log(response.data);
      setSuccessful(true); // response data if successful
      
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(resMessage);
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: resMessage,
        confirmButtonColor: '#d6ba30',
      });
    }
  };

  const handleCodeVerification = async (event) => {
    event.preventDefault(); // prevent from submission
    try {
      const response = await axios.post(
        `http://localhost:9090/user/verify/${email}`,
        {
          verificationCode: verificationCode,
        }
      );
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Signup successful!",
        text: "You have been signed up successfully.",
        confirmButtonColor: '#d6ba30',
      }).then(navigate("/"));
      
    } catch (error) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      console.log(resMessage);
      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: resMessage,
        confirmButtonColor: '#d6ba30',
      });
    }
    }


  return (
    <>
      <div className="signupPage ">
        <main>
          <div className="box">
            <div className="inner-box">
              {successful ? (
                <div className="forms-wrap">
                  <form
                    autoComplete="off"
                    className="sign__up__form"
                    onSubmit={handleCodeVerification}
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
                      <h4>Verify your account</h4>
                    </div>

                    <div className="actual-form">
                      <div className="input-wrap">
                        <label
                          className="label-form"
                          htmlFor="verificationCode"
                        >
                          Verification code
                        </label>
                        <input
                          type="text"
                          id="verificationCode"
                          minLength="4"
                          onChange={onChangeCode}
                          className="input-field"
                          autoComplete="off"
                          required
                        />
                      </div>

                      <div className="reset__options">
                        <div>
                          <input
                            type="submit"
                            className="submit-btn"
                            value="VERIFY"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="forms-wrap">
                  <form
                    autoComplete="off"
                    className="sign__up__form"
                    onSubmit={handleSubmit}
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
                        <label className="label-form" htmlFor="email">
                          Phone Number
                        </label>
                        <PhoneInput
                          id="number"
                          name="number"
                          value={number}
                          onChange={setNumber}
                          defaultCountry="DE"
                          className="input-field"
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
                          <input
                            type="submit"
                            disabled={!isChecked}
                            className="submit-btn"
                            value="SIGNIN"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                  <div className="separators-signup">
                    <hr className="seperator left" />{" "}
                    <b style={{ fontFamily: "font-alethia-pro" }}>OR</b>
                    <hr className="seperator right" />
                  </div>

                  <div className="social-container-signup">
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
              )}
              <div className="carousel_login">
                <div className="">
                  <img alt="" src="./logo-cityflat.png" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Signup;

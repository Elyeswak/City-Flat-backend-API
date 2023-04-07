import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import validator from "validator";
import { isValidNumber } from "libphonenumber-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./signup.css";

function Signup() {
  const userRef = useRef();
  const errRef = useRef();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isValidName, setIsValidName] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [number, setNumber] = useState();
  const [isValidPhoneNumber, setIsValidNumber] = useState(false);
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
    setIsValidName(
      /^[a-zA-Z\s'"]+$/.test(name) && name.length < 50 && name.length > 5
    );
  };

  const onChangeNumber = (e) => {
    const number = document.getElementById("number").value;
    setNumber(number);
    setIsValidNumber(isValidNumber(number));
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
    setIsValidEmail(validator.isEmail(email) && email.length < 60);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
    setIsValidPassword(
      validator.isStrongPassword(password) && /^\S+$/.test(password)
    );
  };
  const onChangeCode = (e) => {
    const code = e.target.value;
    setVerificationCode(code);
  };

  /**REGISTER REQUEST */

  const handleSubmit = async (event) => {
    event.preventDefault(); // prevent form submission
    const phoneNumber = number.replace("+", "");
    const Number = phoneNumber.replace(/\s/g, "");
    if (!isValidName) {
      toast.error("❌ Invalid name!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (!isValidEmail) {
      toast.error("❌ Invalid email!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (!isValidPhoneNumber) {
      toast.error("❌ Invalid phone number!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (!isValidPassword) {
      toast.error("❌ Invalid password!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (isValidName && isValidEmail && isValidPhoneNumber && isValidPassword) {
      try {
        const response = await axios.post(
          "http://localhost:9090/user/register",
          {
            name: name,
            email: email,
            password: password,
            number: Number,
          }
        );
        console.log(response.data);
        setSuccessful(true); // response data if successful
        toast.success("✅ Verification code sent", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.error(error.response.data); // error message if not successful
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
      navigate("/");
    } catch (error) {
      toast.error("❌ Invalid code!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(error.response.data);
    }
  };

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
                          minLength={4}
                          maxLength={4}
                          value={verificationCode}
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
                          type="text"
                          id="email"
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
                          onChange={onChangeNumber}
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

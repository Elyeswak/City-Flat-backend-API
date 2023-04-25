import React, { useState } from "react";
import "./ForgetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {

  const [email,setEmail] = useState('');
  const navigate = useNavigate()

  const handleResetPassword = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.get(`http://localhost:9090/user/reset/${email}`);
      console.log(response.data);
      toast.success("password reset successfully, an Email is sent to you with the new password", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      //navigate to login
      setTimeout(() => {
        navigate('/login');
      }, 2600);
    } catch (error) {
      console.error(error);
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

                  <div className="heading">
                    <h2>WELCOME</h2>
                    <h4>Reset your password</h4>
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

                    <button className="sign-btn" onClick={handleResetPassword}> RESET PASSWORD </button>
                  </div>
                </form>
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


export default ForgetPassword;

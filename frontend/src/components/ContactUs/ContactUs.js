import React, { useState } from "react";
import "./ContactUs.css";
import Navbar from "./../Navbar/Navbar";
import Footer from "./../Footer/footer";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function ContactUs() {

  const navigate = useNavigate();
  /**GET ALL THE USER'S DATA FROM LOCALSTORAGE */
  const user = JSON.parse(localStorage.getItem("user"))
  /** DEFINING HELP BODY */
  const help = {
    message: "",
  };

  const [values, setValues] = useState(help);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = values;
    console.log(data);
  
    try {
      const response = await axios.post(
        "http://localhost:9090/help/messages/sendmessage",
        data,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Message sent successfully!");
      console.log(response);
      setValues(help); // Reset form values
      toast.success("✅ Your message is sent, We'll reach you soon", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        navigate('/');
      }, 2600);
    } catch (error) {
      console.error("Failed to send message:", error.response.data);
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
  };
  
  return (
    <div className="help_page">
      <Navbar />
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
      <div className="help_page_content">
        <div className="container contact-form">
          <div className="row">
            <div className="col-ms-12">
              <form onSubmit={handleSubmit}>
                <h3>DO YOU NEED HELP?</h3>
                <div className="form-group">
                  <textarea
                    name="message"
                    value={values.message}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Your Message"
                    style={{ width: "100%", height: 150, marginBottom: "20px" }}
                  />
                  <div className="form-group" style={{ marginBottom: "20px" }}>
                    <input
                      type="submit"
                      name="btnSubmit"
                      className="btnContact"
                      defaultValue="SEND"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ContactUs;

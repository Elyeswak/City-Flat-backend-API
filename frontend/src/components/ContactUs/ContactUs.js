import React, { useState } from "react";
import "./ContactUs.css";
import Navbar from "./../Navbar/Navbar";
import Footer from "./../Footer/footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocation,
  faLocationArrow,
  faEnvelope,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

function ContactUs() {
  const help = {
    name: "",
    email: "",
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

  return (
    <div className="help_page">
      <Navbar />
      <div className="help_page_content">
        <div className="container contact-form">
          <div className="row">
            <div className="col-md-8">
              <form>
                <h3>DO YOU NEED HELP?</h3>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <input
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Your Name"
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "20px" }}>
                  <input
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Your Email"
                  />
                </div>
                <div className="form-group">
                  <textarea
                    name="message"
                    value={values.message}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Your Message"
                    style={{ width: "100%", height: 150, marginBottom: "20px" }}
                    defaultValue={""}
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
            <div
              className="col-md-4"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                backgroundColor: "#ae9400",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FontAwesomeIcon icon={faLocationArrow} className="fa-circle" />
                <span style={{ marginLeft: "10px", fontSize: "20px" }}>
                  Düsseldorf, Germany
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FontAwesomeIcon icon={faEnvelope} className="fa-circle" />
                <span style={{ marginLeft: "10px", fontSize: "20px" }}>
                  cityflat@germany.com
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <FontAwesomeIcon icon={faPhone} className="fa-circle" />
                <span style={{ marginLeft: "10px", fontSize: "20px" }}>
                  123-456-7890
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ContactUs;

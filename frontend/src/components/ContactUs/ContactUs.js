import React, { useState } from "react";
import "./ContactUs.css";
import Navbar from "./../Navbar/Navbar";
import Footer from "./../Footer/footer"

function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Name: ", name);
    console.log("Email: ", email);
    console.log("Message: ", message);
    alert("Thank you for contacting us!");
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="help_page">
        <Navbar/>
      <div className="help_page_content">
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit} className="help_form">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br/>
          <label>
            Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <Footer/>
    </div>
  );
}

export default ContactUs;

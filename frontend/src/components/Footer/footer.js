import React from 'react'
import './footer.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook,faTwitter,faInstagram,faLinkedin  } from "@fortawesome/free-brands-svg-icons";

function footer() {
  return (
    <div className='footer__page'>
    <footer className="footer__content">
      <div className="footer_row">
        <div className="col-md mb-4 mb-md-0">
          <h3>Company</h3>
          <ul className="list-unstyled nav-links">
            <li><a href="#">About us</a></li>
            <li><a href="#">Why Choose us</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Testimonial</a></li>
          </ul>
        </div>
        <div className="col-md mb-4 mb-md-0">
          <h3>Resources</h3>
          <ul className="list-unstyled nav-links">
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms &amp; Condition</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div className="col-md mb-4 mb-md-0">
          <h3>Product</h3>
          <ul className="list-unstyled nav-links">
            <li><a href="#">Project Managment</a></li>
            <li><a href="#">Time Tracker</a></li>
            <li><a href="#">Time Schedule</a></li>
            <li><a href="#">Lead Generate</a></li>
            <li><a href="#">Remote Collaboration</a></li>
          </ul>
        </div>
        <div className="col-md-4 mb-4 mb-md-0 subscribe__content">
          <h3>CITY FLAT</h3>
          <p className="mb-4">Subscribe to our Newsletter</p>
          <form action="#" className="subscribe">
              <input type="text" className="form-control" placeholder="Enter your e-mail"/>
              <input type="submit" className="btn btn-submit" value="Send"/>
            </form>
        </div>
      </div>

      <div className="footer_row align-items-center">
        <div className="col-12">
          <div className="border-top my-5"></div>
        </div>
        <div className="col-md-6">
          <p><small>&copy; 2023 All Rights Reserved.</small></p>
        </div>
        <div className="col-md-6 text-md-right">
          <ul className="social list-unstyled">
            <li><a href="#"><FontAwesomeIcon icon={faFacebook} className="fa-2x" /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faTwitter} className="fa-2x" /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faInstagram} className="fa-2x" /></a></li>
            <li><a href="#"><FontAwesomeIcon icon={faLinkedin} className="fa-2x" /></a></li>
          </ul>
        </div>
      </div>
    
  </footer>
  </div>
  )
}

export default footer
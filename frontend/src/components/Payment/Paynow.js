import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import Rate from "../Rate/Rate";
import "./paynow.css";
import {
  faBowlFood,
  faCar,
  faParking,
  faShirt,
  faToolbox,
  faTools,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StripeCheckout from "./StripeCheckout";
import PaypalCheckout from "./PaypalCheckout";

export default function Paynow() {
  /**GET ALL ITEMS FROM LOCAL STORAGE */
  const apartment = JSON.parse(localStorage.getItem("apartment"));
  const servicesPrice = JSON.parse(localStorage.getItem("servicesPrice"));
  const apartmentPrice = JSON.parse(localStorage.getItem("apartmentPrice"));
  const totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
  const startDate = JSON.parse(localStorage.getItem("startDate"));
  const endDate = JSON.parse(localStorage.getItem("endDate"));
  const serviceNames = JSON.parse(localStorage.getItem("serviceNames"));
  const diffInDays = JSON.parse(localStorage.getItem("diffInDays"));

  /**DISPLAY ICONS ACCORDING TO THE SERVICES */
  const serviceIcons = {
    Car: <FontAwesomeIcon icon={faCar} />,
    Food: <FontAwesomeIcon icon={faBowlFood} />,
    Utilities: <FontAwesomeIcon icon={faToolbox} />,
    Maintenance: <FontAwesomeIcon icon={faTools} />,
    Parking: <FontAwesomeIcon icon={faParking} />,
    Laundry: <FontAwesomeIcon icon={faShirt} />,
  };

  const [rating, setRating] = useState(0);

  function animateDisplay() {
    const divAnimate = document.getElementById("toAnimate");
    divAnimate && divAnimate.classList.toggle("hidden");
    setpayMeth("")
  }

  const [payMeth, setpayMeth] = useState("");
  const [price, setPrice] = useState(10);

  const handleBuyStripe = () => {
    setpayMeth("stripe");
  };
  const handleBuyPaypal = () => {
    setpayMeth("paypal");
  };

  return (
    <div className="payment_page">
      <Navbar />
      <div className="upper__space"></div>
      <div className="payment__body">
        <div className="payment__content">
          <div className="payment_title">
            <h3>PROCEED YOUR PAYMENT</h3>
          </div>
          <div className="row row_props ">
            <div className="col payment_col">
              <div className="card__body__payment">
                <h4>RESERVATION DETAILS</h4>
                <h5>NIGHTS :{diffInDays}</h5>
                <h5>
                  FROM <strong>{startDate}</strong> TO{" "}
                  <strong>{endDate}</strong>.
                </h5>
                <hr />
                <h4>SERVICES</h4>
                <div className="row services">
                  {serviceNames.map((serviceName) => (
                    <div className="col col-sm-2" key={serviceName}>
                      {serviceIcons[serviceName]}
                      <br />
                      <p className="service_title">{serviceName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="col content_col_payment"
              style={{ backgroundColor: "white" }}
            >
              <div className="card_infos_payment">
                <div className="card__body">
                  <h4>{apartment.name}</h4>
                  <strong style={{ marginBottom: "7%" }}>
                    {apartment.description}
                  </strong>
                  <Rate rating={rating} onRating={(rate) => setRating(rate)} />
                  <img
                    alt="apartment_picture"
                    className="apartment_picture"
                    src="./interior-design-ga22c634af_19201.png"
                  />
                  <h4>PAYMENT DETAILS:</h4>
                  <p>NIGHTS FEES: €{apartmentPrice}</p>
                  <p>SERVICES FEES: €{servicesPrice}</p>
                  <p>TOTAL PRICE: €{totalPrice}</p>
                  <button
                    className="btn btn-dark custom-confirm-button w-50"
                    onClick={animateDisplay}
                  >
                    Pay now
                  </button>
                  <div className="pay-meth hidden" id="toAnimate">
                    <button
                      className="pay-btn btn paypal me-5"
                      onClick={handleBuyPaypal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                        width={30}
                        height={30}
                      >
                        <path d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z" />
                      </svg>
                    </button>
                    <button
                      className="pay-btn btn master ms-5"
                      onClick={handleBuyStripe}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 576 512"
                        width={30}
                        height={30}
                      >
                        <path d="M64 32C28.7 32 0 60.7 0 96v32H576V96c0-35.3-28.7-64-64-64H64zM576 224H0V416c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V224zM112 352h64c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm112 16c0-8.8 7.2-16 16-16H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H240c-8.8 0-16-7.2-16-16z" />
                      </svg>
                    </button>
                    {payMeth === "stripe" ? (
                      <StripeCheckout />
                    ) : payMeth === "paypal" ? (
                      <PaypalCheckout totalPrice={totalPrice} />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

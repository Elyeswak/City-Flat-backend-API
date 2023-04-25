import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import Rate from "../Rate/Rate";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ConfirmationPage.css";
import {
  faBowlFood,
  faBrush,
  faCar,
  faParking,
  faShirt,
  faToolbox,
  faTools,
  faTrashArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  /**GET ALL ITEMS FROM LOCAL STORAGE */
  const user = JSON.parse(localStorage.getItem("user"));
  const apartment = JSON.parse(localStorage.getItem("apartment"));
  const servicesPrice = JSON.parse(localStorage.getItem("servicesPrice"));
  const apartmentPrice = JSON.parse(localStorage.getItem("apartmentPrice"));
  const totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
  const startDate = JSON.parse(localStorage.getItem("startDate"));
  const endDate = JSON.parse(localStorage.getItem("endDate"));
  const serviceNames = JSON.parse(localStorage.getItem("serviceNames"));
  const diffInDays = JSON.parse(localStorage.getItem("diffInDays"));
  const checkIn = JSON.parse(localStorage.getItem("checkIn"));
  const checkOut = JSON.parse(localStorage.getItem("checkOut"));
  const servicesIds = JSON.parse(localStorage.getItem("serviceIds"));

  /**DISPLAY ICONS ACCORDING TO THE SERVICES */
  const serviceIcons = {
    Car: <FontAwesomeIcon icon={faCar} />,
    Food: <FontAwesomeIcon icon={faBowlFood} />,
    Utilities: <FontAwesomeIcon icon={faToolbox} />,
    Maintenance: <FontAwesomeIcon icon={faTools} />,
    Parking: <FontAwesomeIcon icon={faParking} />,
    Laundry: <FontAwesomeIcon icon={faShirt} />,
    Cleaning: <FontAwesomeIcon icon={faTrashArrowUp} />,
  };


  const apartmentID = apartment.id

  /**CREATE AN ORDER */
  function postData() {
    console.log("Request data:");
  
    axios
      .post(
        "http://localhost:9090/user/reservations/createOrder",
        {
          User: user.id,
          appartment: apartmentID,
          description: apartment.description,
          checkIn: checkIn,
          checkOut: checkOut,
          servicesFee: servicesPrice,
          nightsFee: apartmentPrice,
          services: servicesIds,
          totalPrice: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Response data:", response.data);
        // Handle success
        toast.success("Your request is sent", {
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
          navigate('/requests');
        }, 2600);
      })
      .catch((error) => {
        console.error("Error message:", error.response.data);
        // Handle error
        toast.error("❌ An error occured! ", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  }

  return (
    <div className="payment_page">
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
      <div className="upper__space"></div>
      <div className="payment__body">
        <div className="payment__content">
          <div className="payment_title">
            <h3>CONFIRM YOUR PAYMENT</h3>
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
                  <button className="btn btn-dark custom-confirm-button">
                    <Link
                      to={"/paystate"}
                      className="text-light"
                      onClick={postData}
                    >
                      SEND REQUEST
                    </Link>
                  </button>
                  <a href="/">
                    <button
                      type="reset"
                      className="btn btn-dark custom-confirm-button"
                    >
                      CANCEL
                    </button>
                  </a>
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

export default PaymentPage;

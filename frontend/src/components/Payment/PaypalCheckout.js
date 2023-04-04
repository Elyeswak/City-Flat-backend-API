import React, { useState } from "react";
import axios from "axios";
import './paypal.css'

function PayPalCheckout(props) {

  const handleSubmit = async (event) => {
    event.preventDefault();
    const price = props.totalPrice;

    try {
      const response = await axios.get("http://localhost:9090/paypal/pay", {
        price,
      });
      const { approval_url } = response.data.links.find(
        (link) => link.rel === "approval_url"
      );
      window.location.replace(approval_url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    // <form onSubmit={handleSubmit}>
    //   <div className="form-group">
    //     <label htmlFor="price">Price</label>
    //   </div>

    //   <button
    //     type="button"
    //     className="btn btn-secondary"
    //     onClick={handleCancel}
    //   >
    //     Cancel
    //   </button>
    // </form>
    <form onSubmit={handleSubmit} className="form d-flex flex-column px-5">
      <div className="form-row d-flex flex-column">
        <div className="form-group col">
          <label htmlFor="cardNumber">Price €</label>
          <input
            type="number"
            id="price"
            value={props.totalPrice}
            className="form-control text-center"
            readOnly
          />
        </div>
      </div>
      <button
        type="submit"
        className="btn mt-3 text-light pal-btn"
      >
        Pay with PayPal
      </button>
      {/* <button
        type="submit"
        className="btn btn-secondary mt-3"
        onClick={handleCancel}
      >
        Cancel
      </button> */}
    </form>
  );
}

export default PayPalCheckout;

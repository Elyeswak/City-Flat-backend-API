import { useState } from "react";
import axios from "axios";

function PaymentForm(props) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpDate, setCardExpDate] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };
  const handleCardExpDateChange = (event) => {
    setCardExpDate(event.target.value);
  };
  const handleCardCvcChange = (event) => {
    setCardCvc(event.target.value);
  };

  /**
   * 
   */
  const TOTAL = props.price;

  const orderID = localStorage.getItem("orderId");
  const Order = {
    id: orderID,
  };

  const [year, month] = cardExpDate.split("-");

  const handleSubmit = (event) => {
    event.preventDefault();

    const card = {
      number: cardNumber,
      exp_month: month && month,
      exp_year: year && year,
      cvc: cardCvc,
    };

    const user = JSON.parse(localStorage.getItem("user"));

    const reservationData = {
      Order,
      Card: card,
    };
    console.log(reservationData);
    axios
      .post(
        "http://localhost:9090/user/reservations/addReservation",
        reservationData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        window.location.replace("/thankyou");
      })
      .catch((error) => {
        console.error(error);
        // handle error during reservation creation
      });
  };

  return (


<>
    <form onSubmit={handleSubmit} className="form d-flex flex-column px-5">
      <div className="form-row d-flex flex-column">
        <div className="form-group col">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={16}
            className="form-control"
          />
        </div>
        <div className="form-group col">
          <label htmlFor="cardExpMonth">Expiration Date</label>
          <input
            type="month"
            id="cardExpMonth"
            name="cardExpMonth"
            value={cardExpDate}
            onChange={handleCardExpDateChange}
            className="form-control"
          />
        </div>
      </div>
      <div className="form-row d-flex flex-column">
        <div className="form-group col">
          <label htmlFor="cardCvc">CVC</label>
          <input
            type="text"
            id="cardCvc"
            name="cardCvc"
            value={cardCvc}
            onChange={handleCardCvcChange}
            maxLength={4}
            className="form-control"
          />
        </div>
      </div>
      <button type="submit" className="btn btn-success mt-3">
        Pay
      </button>
    </form>
    </>
  );
}

function StripeCheckout(props) {
  const price = props.totalPrice;
  return <PaymentForm price={price} />;
}

export default StripeCheckout;

import { loadStripe } from "@stripe/stripe-js";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(
  "pk_test_51Mo7T4CVJIsh8jvhT4XERDGMYNJjV3zpKsnVxpD79NGbrGT2337sDSuengg06jYxuRwvMShAg91ih2ziOUUKJD6000ci0xZXRW"
);

const Order = {
  id: "6421723ad4d003e8797296cd",
};

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState();
  const [cardExpDate, setCardExpDate] = useState();
  const [cardCvc, setCardCvc] = useState();
  const [month, year] = cardExpDate.split("/");
  console.log(month); // '04'
  console.log(year); // '2023'

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };
  const handleCardExpDateChange = (event) => {
    setCardExpDate(event.target.value);
  };
  const handleCardCvcChange = (event) => {
    setCardCvc(event.target.value);
  };

  const card = {
    number: cardNumber,
    exp_month: month,
    exp_year: year,
    cvc: cardCvc,
  };

  console.log(Order, card);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(
      "http://localhost:9090/user/reservations/addReservation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Order, card),
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="d-flex flex-column align-items-start"
    >
      <div className="row">
        <label htmlFor="cardNumber" className="col-6">
          Card Number
        </label>
        <input
          type="text"
          id="cardNumber"
          name="cardNumber"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="col-6"
        />
      </div>

      <div className="row">
        <label className="col-6" htmlFor="cardExpMonth">
          Expiration Date
        </label>
        <input
          type="month"
          id="cardExpMonth"
          name="cardExpMonth"
          value={cardExpDate}
          className="col-6"
          onChange={handleCardExpDateChange}
        />
      </div>
      <div className="row">
        <label className="col-6" htmlFor="cardCvc">
          CVC
        </label>
        <input
          type="text"
          id="cardCvc"
          name="cardCvc"
          value={cardCvc}
          className="col-6"
          onChange={handleCardCvcChange}
        />
      </div>
      <button type="submit">
        Pay
      </button>
    </form>
  );
}

function PaymentPageStripe() {
  return <PaymentForm />;
}

export default PaymentPageStripe;

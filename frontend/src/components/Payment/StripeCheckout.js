import { useState } from "react";
import axios from "axios";
const Order = {
  id: "6421723ad4d003e8797296cd",
};

function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpDate, setCardExpDate] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [month, setmonth] = useState("");
  const [year, setyear] = useState("");

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };
  const handleCardExpDateChange = (event) => {
    setCardExpDate(event.target.value);
  };
  const handleCardCvcChange = (event) => {
    setCardCvc(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (cardExpDate) {
      setmonth(cardExpDate.split("-")[1]);
      setyear(cardExpDate.split("-")[0]);
    }

    const card = {
      number: cardNumber,
      exp_month: month,
      exp_year: year,
      cvc: cardCvc,
    };

    const reservationData = {
      Order,
      Card: card,
    };
    console.log(reservationData);
    axios
      .post(
        "http://localhost:9090/user/reservations/addReservation",
        reservationData
      )
      .then((response) => {
        console.log(response.data);
        // handle successful reservation creation
      })
      .catch((error) => {
        console.error(error);
        // handle error during reservation creation
      });
  };

  return (
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
  );
}

function StripeCheckout() {
  return <PaymentForm />;
}

export default StripeCheckout;

import React, { useState } from "react";
import Paynow from "./Paynow";
import ReservationHistory from "./ReservationHistory";

export default function Payment() {
  const [isApproved, setIsApproved] = useState(true)
  return (
    <div className="Payment-container">
      {isApproved ? <Paynow /> : <ReservationHistory />}
    </div>
  );
}

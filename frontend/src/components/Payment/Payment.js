import React, { useState } from "react";
import Paynow from "./Paynow";
import RequestsPage from "./../Requests/RequestsPage"

export default function Payment() {
  const [isApproved, setIsApproved] = useState(false)
  return (
    <div className="Payment-container">
      {isApproved ? <Paynow /> : <RequestsPage />}
    </div>
  );
}

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AddApartmentForm from "./AddAppartmentForm";
import "./AppartmentDash.css";
import axios from "axios";
import AllAppartments from "./AllAppartments";

export default function AppartmentDash() {
  const handleSubmit = async ({
    name,
    description,
    pricePerNight,
    location,
    type,
    rooms,
    services,
    img,
  }) => {
    try {
      const formData = {
        name,
        description,
        pricePerNight,
        location,
        type,
        rooms,
        services,
        img,
      };

      const res = await axios.post(
        "http://localhost:9090/appartments/addAppart",
        formData
      );

      console.log(res.data); // Log the response data
    } catch (err) {
      console.error(err); // Handle error here
    }
  };

  const [show, setShow] = useState("all");

  return (
    <>
      <Sidebar />
      <div className="appart-dash-cont bg-dark text-light">
        <ul className="appart-dash-nav">
          <li onClick={()=>{setShow("all")}} className="">All appartments</li>
          <li onClick={() => { setShow("add")}}>Add appartment</li>
        </ul>
        {show === "all" ? (
          <AllAppartments />
        ) : (
          <AddApartmentForm onSubmit={handleSubmit} />
        )}
      </div>
    </>
  );
}

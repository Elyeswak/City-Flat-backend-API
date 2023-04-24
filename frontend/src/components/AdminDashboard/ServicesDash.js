import React, { useState } from "react";
import Sidebar from "./Sidebar";
import "./ServicesDash.css";
import axios from "axios";
import AllServices from "./AllServices";
import AddServiceForm from "./AddServiceForm";

export default function ServicesDash() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const handleSubmit = async ({ name, description, pricePerNight }) => {
    try {
      const formServiceData = {
        name,
        description,
        pricePerNight,
      };

      const res = await axios.post(
        "http://localhost:9090/user/services/addService",
        formServiceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
          <li
            onClick={() => {
              setShow("all");
            }}
            className=""
          >
            All services
          </li>
          <li
            onClick={() => {
              setShow("add");
            }}
          >
            Add service
          </li>
        </ul>
        {show === "all" ? (
          <AllServices />
        ) : (
          <AddServiceForm onSubmit={handleSubmit} />
        )}
      </div>
    </>
  );
}

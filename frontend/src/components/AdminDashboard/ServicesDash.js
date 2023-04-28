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
      <div className="services-dash-cont bg-dark text-light">
        <h1 className="text-light text-center">Services Dashboard</h1>
        <ul className="services-dash-nav d-flex">
          <li
            onClick={() => {
              setShow("all");
            }}
            className=""
          >
            <button className="btn btn-primary me-3">All services</button>
          </li>
          <li
            onClick={() => {
              setShow("add");
            }}
          >
            <button className="btn btn-success">➕ Add</button>
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

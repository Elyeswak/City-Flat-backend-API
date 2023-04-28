import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AddApartmentForm from "./AddAppartmentForm";
import "./AppartmentDash.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import AllAppartments from "./AllAppartments";

export default function AppartmentDash() {
  // const [postSuccess, setPostSuccess] = useState(false)
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
      toast.success("✅ Appartment added successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(res.data); // Log the response data
      // setPostSuccess(true)
    } catch (err) {
      console.error(err); // Handle error here
      // setPostSuccess(false);
      let message = err.message;
      if (message.includes("409")) {
        toast.error("❌ An appartment with this name already exists!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error("❌ An error occured while trying to add the appartment!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };

  const [show, setShow] = useState("all");

  return (
    <>
      <Sidebar />
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
      <div className="appart-dash-cont bg-dark text-light">
        <h1 className="text-light text-center">Appartments Dashboard</h1>
        <ul className="appart-dash-nav d-flex">
          <li
            onClick={() => {
              setShow("all");
            }}
            className=""
          >
            <button className="btn btn-primary me-3">All appartments</button>
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
          <AllAppartments />
        ) : (
          <AddApartmentForm onSubmit={handleSubmit} />
        )}
      </div>
    </>
  );
}

import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import AddApartmentForm from "./AddAppartmentForm";
import "./AppartmentDash.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import AllAppartments from "./AllAppartments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

export default function AppartmentDash() {
  // const [postSuccess, setPostSuccess] = useState(false)
  const [User, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `http://localhost:9090/user/${User.id}`
        );
        const user = response.data;
        console.log("returned user from db", user);
        setIsAdmin(user.role === "ADMIN");
      } catch (error) {
        console.error(error);
      }
    }

    if (User) {
      getUser();
    }
  }, [User]);
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
      setShow("all");
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
      {isAdmin ? (
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
            <h1 className="text-light text-center my-3">
            Apartment-Dashboard
            </h1>
            <ul className="appart-dash-nav d-flex">
              <li
                onClick={() => {
                  setShow("all");
                }}
                className=""
              >
                <button className="btn btn-primary me-3">
                  Alle apartments
                </button>
              </li>
              <li
                onClick={() => {
                  setShow("add");
                }}
              >
                <button className="btn btn-success"><FontAwesomeIcon icon={faAdd}/> Add</button>
              </li>
            </ul>
            {show === "all" ? (
              <AllAppartments />
            ) : (
              <AddApartmentForm onSubmit={handleSubmit} />
            )}
          </div>
        </>
      ) : (
        <div className="div-denied d-flex align-items-center justify-content-center">
          <h1 className="text-center display-1">
            ⚠️ 404 NOT FOUND
          </h1>
        </div>
      )}
    </>
  );
}

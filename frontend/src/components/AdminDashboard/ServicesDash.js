import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./ServicesDash.css";
import axios from "axios";
import AllServices from "./AllServices";
import AddServiceForm from "./AddServiceForm";

export default function ServicesDash() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
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
      {isAdmin ? (
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

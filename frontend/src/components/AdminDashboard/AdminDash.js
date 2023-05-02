import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import OrdersDash from "./OrdersDash";
import HelpRequest from "./HelpRequest";
import axios from "axios";

export default function AdminDash() {
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

  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleShowHelpModal = () => setShowHelpModal(true);
  const handleCloseHelpModal = () => setShowHelpModal(false);

  return (
    <>
      {isAdmin ? (
        <>
          <Sidebar onHelpClick={handleShowHelpModal} />
          <OrdersDash />
          <HelpRequest show={showHelpModal} onHide={handleCloseHelpModal} />
        </>
      ) : (
        <div className="div-denied bg-dark d-flex align-items-center justify-content-center">
          <h1 className="text-warning text-center display-1">
            ⚠️ 404 NOT FOUND
          </h1>
        </div>
      )}
    </>
  );
}

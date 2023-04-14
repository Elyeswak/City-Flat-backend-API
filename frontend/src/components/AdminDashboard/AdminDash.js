import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import OrdersDash from "./OrdersDash";
import HelpRequest from "./HelpRequest";

export default function AdminDash() {
  const [User, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const isAdmin = User && User.role === "ADMIN";
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
            ⚠️ access denied !!!
          </h1>
        </div>
      )}
    </>
  );
}

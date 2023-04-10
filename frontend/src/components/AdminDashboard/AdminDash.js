import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function AdminDash() {
  const [User, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const isAdmin = User && User.role === "ADMIN";
  
  return (
    <>
      {isAdmin ? (
        <Sidebar />
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

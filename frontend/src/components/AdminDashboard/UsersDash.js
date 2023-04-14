import React from "react";
import Sidebar from "./Sidebar";
import './UsersDash.css'

export default function UsersDash() {
  return (
    <div className="bg-dark userDashContainer">
      <Sidebar />
      <p>UsersDash</p>
    </div>
  );
}

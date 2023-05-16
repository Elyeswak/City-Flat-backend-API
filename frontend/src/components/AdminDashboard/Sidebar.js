import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import "./sidebar.css";
import { Link } from "react-router-dom";
import HelpRequest from "./HelpRequest";

function Sidebar(props) {
  const options = [
    {
      name: "Enable both scrolling & backdrop",
      scroll: true,
      backdrop: true,
    },
  ];

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const toggleShow = () => setShow((s) => !s);

  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleOpenHelpModal = () => {
    setShowHelpModal(true);
    handleClose()
  };

  const handleCloseHelpModal = () => {
    setShowHelpModal(false);
  };

  return (
    <>
      <Button onClick={toggleShow} className="toggler">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          fill="currentColor"
          class="bi bi-list"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </Button>
      <Offcanvas show={show} onHide={handleClose}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="text-light display-6">
            Admin Dashboard
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="sidebar-menu">
            <li className="fs-5">
              <Link to={"/"}>Home</Link>
            </li>
            <li className="fs-5">
              <Link to={"/ordersdash"}>Buchungen</Link>
            </li>
            <li className="fs-5">
              <Link to={"/appartdash"}>Apartments</Link>
            </li>
            <li className="fs-5">
              <Link to={"/servdash"}>Dienstleistungen</Link>
            </li>
            <li className="fs-5">
              <Link to={"/userdash"}>Benutzer</Link>
            </li>
            <li className="fs-5">
              <a href="#" onClick={handleOpenHelpModal}>
              Hilfe
              </a>
            </li>
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
      <HelpRequest show={showHelpModal} onClose={handleCloseHelpModal} />
    </>
  );
}

export default Sidebar;

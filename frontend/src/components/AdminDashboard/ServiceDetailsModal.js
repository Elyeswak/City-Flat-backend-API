import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import "./AppartmentsDetails.css";

export default function ServiceDetailsModal(props) {
  const { service, show, handleClose } = props;
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Service Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="my-2">
            <strong>Name: </strong> {service.name}
          </div>
          <div className="my-2">
            <strong>Price per night: </strong>£ {service.pricePerNight}
          </div>
          <div>
            <strong>Description: </strong>
            <p>{service.description}</p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

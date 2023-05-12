import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import moment from "moment";

export default function OrderDetailsModal(props) {
  const { order, show, handleClose } = props;

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p>
            <strong>Apartment:</strong> {order.appartment.name}
          </p>
          <p>
            <strong>Dienstleistungen:</strong>
            <ul>
              {order.services.map((service, index) => (
                <li>{service}</li>
              ))}
            </ul>
          </p>
          <p>
            <strong>Erstellt am:</strong>{" "}
            {moment(order.createdAt).format("DD MMMM YYYY")}
          </p>
          <p>
            <strong>Check-in:</strong>{" "}
            {moment(order.checkIn).format("DD MMMM YYYY")}
          </p>
          <p>
            <strong>Check-out:</strong>{" "}
            {moment(order.checkOut).format("DD MMMM YYYY")}
          </p>
          <p>
            <strong>Gesamtpreis:</strong> €{order.totalPrice}
          </p>
          <p>
            <strong>Status:</strong> {order.state}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
        Schließen
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

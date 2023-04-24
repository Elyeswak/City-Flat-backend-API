import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import "./AppartmentsDetails.css";
import axios from "axios";
import { Table } from "react-bootstrap";

export default function AppartmentDetailsModal(props) {
  const { appartment, show, handleClose } = props;
  const [serviceDetails, setServiceDetails] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const promises = appartment.services.map((serviceId) =>
        axios.get(`http://localhost:9090/user/services/${serviceId}`)
      );
      const results = await Promise.all(promises);
      const servicesData = results.map((result) => result.data);
      setServiceDetails(servicesData);
    };
    fetchData();
  }, [appartment.services]);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Apartment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="my-2">
            <strong>Name: </strong> {appartment.name}
          </div>
          <div>
            <strong>Description: </strong>
            <p>{appartment.description}</p>
          </div>
          <div className="my-2">
            <strong>Appartment reviews: </strong>
            {appartment.reviews.length === 0 ? (
              <p>
                <strong>no reviews</strong>
              </p>
            ) : (
              <ul>
                {appartment.reviews.map((review) => (
                  <li>{review}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="my-2">
            <strong>Appartment services: </strong>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Night price</th>
                </tr>
              </thead>
              <tbody>
                {serviceDetails.map((service) => (
                  <tr>
                    <td>{service.name}</td>
                    <td>{service.description}</td>
                    <td>{service.pricePerNight}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <img src={appartment.img} />
        </div>
      </Modal.Body>
    </Modal>
  );
}

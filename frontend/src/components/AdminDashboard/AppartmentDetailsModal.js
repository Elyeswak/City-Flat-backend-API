import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import "./AppartmentsDetails.css";
import axios from "axios";
import { Carousel, Table } from "react-bootstrap";

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
        <Modal.Title>Appartement-Details </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="my-2">
            <strong>Name: </strong> {appartment.name}
          </div>
          <div>
            <strong>Beschreibung: </strong>
            <p>{appartment.description}</p>
          </div>

          <div className="my-2">
            <strong>Apartment-Dienstleistungen: </strong>
            <Table>
              <thead style={{color:"white"}}>
                <tr>
                  <th>Name</th>
                  <th>Beschreibung</th>
                  <th>Preis pro Nacht</th>
                </tr>
              </thead>
              <tbody style={{color:"white"}}>
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
          {/* <img src={appartment.img} className="img-fluid" /> */}
          <Carousel>
            {appartment.img.map((image) => (
              <Carousel.Item>
                <img src={image} className="img-fluid" />
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
      </Modal.Body>
    </Modal>
  );
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import AllServicesRow from "./AllServicesRow";
import ServiceDetailsModal from "./ServiceDetailsModal";
import './ServicesDash.css'

export default function AllServices() {
  const [allServices, setAllServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  // getAllAppart
  useEffect(() => {
    axios
      .get(`http://localhost:9090/user/service/getAllServices`)
      .then((response) => {
        setAllServices(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleShowDetails = (srv) => {
    setSelectedService(srv);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedService(null);
    setShowModal(false);
  };
  return (
    <>
      <div className="all-services-cont">
        <Table responsive className="text-light">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Preis pro Nacht</th>
              <th colSpan={2}>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {allServices.map((srv, index) => (
              <AllServicesRow
                srv={srv}
                index={index}
                handleShowDetails={handleShowDetails}
                allServices={allServices}
                setAllServices={setAllServices}
              />
            ))}
          </tbody>
        </Table>
      </div>
      {selectedService && (
        <ServiceDetailsModal
          service={selectedService}
          show={showModal}
          handleClose={() => {
            setSelectedService(null);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}

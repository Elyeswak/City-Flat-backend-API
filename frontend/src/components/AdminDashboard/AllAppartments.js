import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import AllAppartmentsRow from "./AllAppartmentsRow";
import AppartmentDetailsModal from "./AppartmentDetailsModal";

export default function AllAppartments() {
  const [allAppartments, setAllAppartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppartment, setSelectedAppartment] = useState(null);
  // getAllAppart
  useEffect(() => {
    axios
      .get(`http://localhost:9090/appartments/getAllAppart`)
      .then((response) => {
        setAllAppartments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleShowDetails = (appart) => {
    setSelectedAppartment(appart);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedAppartment(null);
    setShowModal(false);
  };
  return (
    <>
      <div className="w-100">
        <Table responsive className="text-light">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Night price</th>
              <th>Location</th>
              <th>Type</th>
              <th>Rooms</th>
              <th colSpan={2}>Appartment action</th>
            </tr>
          </thead>
          <tbody>
            {allAppartments.map((appart, index) => (
              <AllAppartmentsRow
                appart={appart}
                index={index}
                handleShowDetails={handleShowDetails}
                allAppartments={allAppartments}
                setAllAppartments={setAllAppartments}
              />
            ))}
          </tbody>
        </Table>
      </div>
      {selectedAppartment && (
        <AppartmentDetailsModal
          appartment={selectedAppartment}
          show={showModal}
          handleClose={() => {
            setSelectedAppartment(null);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
}

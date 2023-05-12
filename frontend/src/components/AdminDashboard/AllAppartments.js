import axios from "axios";
import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import AllAppartmentsRow from "./AllAppartmentsRow";
import { ToastContainer, toast } from "react-toastify";
import { Form } from "react-bootstrap";
import AppartmentDetailsModal from "./AppartmentDetailsModal";
import "./AppartmentDash.css";

export default function AllAppartments() {
  const [allAppartments, setAllAppartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppartment, setSelectedAppartment] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  let filteredAllAppartments = [];
  let filteredAppartments = filteredAllAppartments;
  const [value, setValue] = useState(0);
  // getAllAppart
  useEffect(() => {
    axios
      .get(`http://localhost:9090/appartments/getAllAppart`)
      .then((response) => {
        setAllAppartments(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("❌ Ein Fehler ist aufgetreten, während versucht wurde, Wohnungen zu erhalten!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
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

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setFilterValue(filter);
  };

  // filter the orders array based on the selected filter value
  if (
    filterValue === "LUXURY" ||
    filterValue === "PREMIUM" ||
    filterValue === "STANDARD"
  ) {
    filteredAllAppartments = allAppartments.filter(
      (appart) => appart.type === filterValue
    );
  }
  if (filterValue === "") {
    filteredAllAppartments = allAppartments;
  }
  if (value !== 0) {
    filteredAppartments = filteredAllAppartments.filter(
      (appart) => appart.rooms == value
    );
  }

  if (value == 0) {
    filteredAppartments = filteredAllAppartments;
  }
  
  return (
    <>
      <div className="all-apparts-cont">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Table responsive className="text-light">
          <thead>
            <tr>
              <th colSpan={5}></th>
              <th colSpan={1}>
                <Form.Control
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  min={0}
                  max={10}
                />
              </th>
              <th colSpan={2}>
                <div className="d-flex justify-content-end">
                  <select
                    class="form-control"
                    aria-label="Default select example"
                    onChange={handleFilterChange}
                  >
                    <option selected value="">
                      {filterValue === "" ? "Filter" : "Reset"}
                    </option>
                    <optgroup label="APARTMENTTYP">
                      <option value="LUXURY">Luxus</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="STANDARD">Standard</option>
                    </optgroup>
                  </select>
                </div>
              </th>
            </tr>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Preis pro Nacht</th>
              <th>Ort</th>
              <th>Typ</th>
              <th>Zimmer</th>
              <th>Bewertung</th>
              <th>Aktionen </th>
            </tr>
          </thead>
          <tbody>
            {filteredAllAppartments.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <p className="text-light text-center">
                  Keine passenden Wohnungen gefunden.
                  </p>
                </td>
              </tr>
            ) : (
              filteredAppartments.map((appart, index) => (
                <AllAppartmentsRow
                  appart={appart}
                  index={index}
                  handleShowDetails={handleShowDetails}
                  allAppartments={filteredAppartments}
                  setAllAppartments={setAllAppartments}
                />
              ))
            )}
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

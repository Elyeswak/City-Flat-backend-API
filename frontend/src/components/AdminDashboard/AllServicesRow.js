import axios from "axios";
import React, { useState } from "react";
import "./ServicesDash.css";
import { Button, Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";

export default function AllServicesRow({
  index,
  allServices,
  setAllServices,
  handleShowDetails,
  srv,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(srv.name);
  const [description, setDescription] = useState(srv.description);
  const [pricePerNight, setPricePerNight] = useState(srv.pricePerNight);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const handleDelete = (srvId) => {
    if (confirmingDelete) {
      axios
        .delete(`http://localhost:9090/user/services/${srvId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // remove the declined order from the orders array
          const updatedAppartments = allServices.filter(
            (appart) => appart.id !== srvId
          );
          setAllServices(updatedAppartments);

          // add the declined order to the declinedOrders array
          // const declinedOrder = orders.find((order) => order.id === appartId);
          // setDeclinedOrders([...declinedOrders, declinedOrder]);

          console.log(response.data); // handle response data
        })
        .catch((e) => {
          console.log(e.message); // handle error
        })
        .finally(() => {
          setConfirmingDelete(false);
        });
    } else {
      setConfirmingDelete(true);
      setTimeout(() => {
        setConfirmingDelete(false);
      }, 3000);
    }
  };
  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);
  const handleSaveChanges = (e) => {
    e.preventDefault();
    const updatedSrv = {
      name: name,
      description: description,
      pricePerNight: pricePerNight,
    };

    axios
      .put(
        `http://localhost:9090/user/services/${srv.id}`,
        updatedSrv,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Update the apartment data in the state
        const updatedSrv = allServices.map((a) =>
          a.id === srv.id ? response.data : a
        );
        setAllServices(updatedSrv);

        toast.success("✅ Changes saved successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        handleCloseEditModal();
      })
      .catch((error) => {
        console.log(error);
        toast.error("❌ An error occured while trying to save the changes!", {
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
  };
  return (
    <>
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
      <tr key={index + 1} className="services-dash-row">
        <td className="services-dash-row-index" onClick={handleShowEditModal}>
          {index + 1} <span>🖋️</span>
        </td>
        <td>{srv.name}</td>
        <td>£ {srv.pricePerNight}</td>
        <td>
          <div>
            <button
              className="btn btn-danger rounded-pill"
              onClick={() => handleDelete(srv.id)}
            >
              {confirmingDelete ? "Confirm" : "Delete"}
            </button>
          </div>
        </td>
        <td>
          <button
            className="btn btn-info rounded-pill ml-2"
            onClick={() => handleShowDetails(srv)}
          >
            Details
          </button>
        </td>
      </tr>
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Appartment</Modal.Title>
        </Modal.Header>
        {/* handleEditChange */}
        <Modal.Body>
          <Form
            onSubmit={handleSaveChanges}
            className="row gy-3 text-start mx-auto"
          >
            <Form.Group controlId="formName" className="col-6">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPrice" className="col-6">
              <Form.Label>Price per night</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price per night"
                value={pricePerNight}
                onChange={(event) => setPricePerNight(event.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="col-12">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-25 mx-auto mt-3"
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./AppartmentDash.css";
import { Button, Form, Modal } from "react-bootstrap";

export default function AllAppartmentsRow({
  index,
  appart,
  allAppartments,
  setAllAppartments,
  handleShowDetails,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState(appart.name);
  const [description, setDescription] = useState(appart.description);
  const [pricePerNight, setPricePerNight] = useState(appart.pricePerNight);
  const [location, setLocation] = useState(appart.location);
  const [rooms, setRooms] = useState(appart.rooms);
  const [type, setType] = useState(appart.type);
  const [img, setImg] = useState("");
  const [services, setSrv] = useState([].concat(...appart.services));
  const [foundSrv, setFoundSrv] = useState([]);
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descError, setDescError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [roomsError, setRoomsError] = useState("");
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    // fetch all services
    axios
      .get(`http://localhost:9090/user/service/getAllServices`)
      .then((response) => {
        setFoundSrv(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("❌ An error occured while trying to get the services!", {
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

  const handleShowEditModal = () => setShowEditModal(true);
  const handleCloseEditModal = () => setShowEditModal(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const handleDelete = (appartId) => {
    if (confirmingDelete) {
      axios
        .delete(`http://localhost:9090/user/appartments/${appartId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // remove the declined order from the orders array
          const updatedAppartments = allAppartments.filter(
            (appart) => appart.id !== appartId
          );
          setAllAppartments(updatedAppartments);

          toast.success("✅ Appartment deleted successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          // add the declined order to the declinedOrders array
          // const declinedOrder = orders.find((order) => order.id === appartId);
          // setDeclinedOrders([...declinedOrders, declinedOrder]);

          console.log(response.data); // handle response data
        })
        .catch((e) => {
          console.log(e.message); // handle error
          toast.error(
            "❌ An error occured while trying to delete the appartment!",
            {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            }
          );
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

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const updatedAppart = {
      name: name,
      description: description,
      pricePerNight: pricePerNight,
      location: location,
      rooms: rooms,
      type: type,
      services: services.map((str) => [str]),
      img: img,
    };

    axios
      .put(
        `http://localhost:9090/user/appartments/${appart.id}`,
        updatedAppart,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        // Update the apartment data in the state
        const updatedApparts = allAppartments.map((a) =>
          a.id === appart.id ? response.data : a
        );
        setAllAppartments(updatedApparts);

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
      <tr key={index} className="appart-dash-row">
        <td className="appart-dash-row-index" onClick={handleShowEditModal}>
          {index + 1}
          <span>🖋️</span>
        </td>
        <td>{appart.name}</td>
        <td>£ {appart.pricePerNight}</td>
        <td>{appart.location}</td>
        <td>{appart.type}</td>
        <td>{appart.rooms}</td>
        <td>
          <div>
            <button
              className="btn btn-danger rounded-pill"
              onClick={() => handleDelete(appart.id)}
            >
              {confirmingDelete ? "Confirm" : "Delete"}
            </button>
          </div>
        </td>
        <td>
          <button
            className="btn btn-info rounded-pill ml-2"
            onClick={() => handleShowDetails(appart)}
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
          {/* <p>Name: {appart.name}</p>
          <p>Price per night: £ {appart.pricePerNight}</p>
          <p>Location: {appart.location}</p>
          <p>Type: {appart.type}</p>
          <p>Rooms: {appart.rooms}</p> */}
          <Form
            className="row gy-3 text-start mx-auto"
            id="addAppartForm"
            onSubmit={handleSaveChanges}
          >
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
            <Form.Group controlId="formName" className="col-6">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {nameError !== "" ? (
                <div className="invalid-feedback d-block">{nameError}</div>
              ) : null}
            </Form.Group>

            <Form.Group controlId="formPrice" className="col-6">
              <Form.Label>Price per night</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price per night"
                value={pricePerNight}
                onChange={(event) => setPricePerNight(event.target.value)}
              />
              {priceError && (
                <div className="invalid-feedback d-block">{priceError}</div>
              )}
            </Form.Group>
            <Form.Group controlId="formDescription" className="col-12">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              {descError && (
                <div className="invalid-feedback d-block">{descError}</div>
              )}
            </Form.Group>

            <Form.Group controlId="formLocation" className="col-6">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              {locationError && (
                <div className="invalid-feedback d-block">{locationError}</div>
              )}
            </Form.Group>

            <Form.Group controlId="formType" className="col-6">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="" selected>
                  Select type
                </option>
                <option value="STANDARD">Standard</option>
                <option value="PREMIUM">Premium</option>
                <option value="LUXURY">Luxury</option>
              </Form.Control>
              {typeError && (
                <div className="invalid-feedback d-block">{typeError}</div>
              )}
            </Form.Group>

            <Form.Group controlId="formRooms" className="col-6">
              <Form.Label>Rooms</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of rooms"
                value={rooms}
                onChange={(event) => setRooms(event.target.value)}
              />
              {roomsError && (
                <div className="invalid-feedback d-block">{roomsError}</div>
              )}
            </Form.Group>

            <Form.Group controlId="services" className="col-6">
              <Form.Label>Services</Form.Label>
              <div>
                {foundSrv.map((service) => (
                  <Form.Check
                    key={service.id}
                    type="checkbox"
                    label={service.name}
                    checked={services.includes(service.id)}
                    value={service.id}
                    onChange={(event) => {
                      const serviceId = event.target.value;
                      if (event.target.checked) {
                        // add the service id to the services array
                        setSrv((prevServices) => [...prevServices, serviceId]);
                      } else {
                        // remove the service id from the services array
                        setSrv((prevServices) =>
                          prevServices.filter((id) => id !== serviceId)
                        );
                      }
                    }}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group controlId="formImg" className="col-12">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                placeholder="Enter image of appartment"
                value={img}
                onChange={(event) => setImg(event.target.value)}
              />
              {imageError && (
                <div className="invalid-feedback d-block">{imageError}</div>
              )}
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-25 mx-auto mt-3"
            >
              Submit
            </Button>
          </Form>
          {/* add any other details here */}
        </Modal.Body>
      </Modal>
    </>
  );
}

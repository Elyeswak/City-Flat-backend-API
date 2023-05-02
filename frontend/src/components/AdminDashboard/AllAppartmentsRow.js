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
  const [img, setImg] = useState([{ id: 1, value: "" }]);
  const [services, setSrv] = useState(appart.services);
  const [foundSrv, setFoundSrv] = useState([]);
  const [nameError, setNameError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descError, setDescError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [typeError, setTypeError] = useState("");
  const [roomsError, setRoomsError] = useState("");
  const [imageError, setImageError] = useState("");
  const [imgCount, setImgCount] = useState(1);
  const [imgUrls, setImgUrls] = useState([]);

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
      services: services,
      img: imgUrls,
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

  const handleAddImageField = () => {
    setImg((prevImg) => [...prevImg, { id: imgCount + 1, value: "" }]);
    setImgCount(imgCount + 1);
  };

  const handleRemoveImageField = (index) => {
    setImg((prevImg) => prevImg.filter((item, i) => i !== index));
  };

  useEffect(() => {
    setImgUrls(img.map((image) => image.value));
  }, [img]);

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
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{appart.name}</td>
        <td>£ {appart.pricePerNight}</td>
        <td>{appart.location}</td>
        <td>{appart.type}</td>
        <td>{appart.rooms}</td>
        <td className="d-flex justify-content-center">
          <div className="me-2">
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(appart.id)}
            >
              {confirmingDelete ? "✔️" : "🗑️"}
            </button>
          </div>
          <button
            className="btn btn-secondary me-2"
            onClick={handleShowEditModal}
          >
            🖋️
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleShowDetails(appart)}
          >
            ℹ️
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
                    checked={services && services.includes(service.id)}
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

            <Form.Group controlId="image">
              <Form.Label>Images</Form.Label>
              {img.map((imgField, index) => (
                <div
                  key={imgField.id}
                  className="d-flex mb-2 align-items-center"
                >
                  <Form.Control
                    type="url"
                    placeholder={`Image URL ${index + 1}`}
                    value={imgField.value}
                    onChange={(e) =>
                      setImg((prevImg) =>
                        prevImg.map((item) =>
                          item.id === imgField.id
                            ? { ...item, value: e.target.value }
                            : item
                        )
                      )
                    }
                  />
                  {index !== 0 && (
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveImageField(index)}
                      className="ms-2"
                    >
                      X
                    </Button>
                  )}
                  {index === img.length - 1 && (
                    <Button
                      variant="success"
                      onClick={handleAddImageField}
                      className="ms-2"
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
              {imageError && (
                <Form.Text className="text-danger">{imageError}</Form.Text>
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

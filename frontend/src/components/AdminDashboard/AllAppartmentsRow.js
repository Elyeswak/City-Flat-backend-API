import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./AppartmentDash.css";
import { Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

export default function AllAppartmentsRow({
  index,
  appart,
  allAppartments,
  setAllAppartments,
  handleShowDetails,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState(0);
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState(0);
  const [rating, setRating] = useState(0);
  const [type, setType] = useState("");
  const [img, setImg] = useState([""]);
  const [services, setSrv] = useState([]);
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
        toast.error("❌ Beim Abrufen der Dienste ist ein Fehler aufgetreten!", {
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
  // const handleDelete = (appartId) => {
  //   if (confirmingDelete) {
  //     axios
  //       .delete(`http://localhost:9090/user/appartments/${appartId}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((response) => {
  //         // remove the declined order from the orders array
  //         const updatedAppartments = allAppartments.filter(
  //           (appart) => appart.id !== appartId
  //         );
  //         setAllAppartments(updatedAppartments);

  //         toast.success("✅ Appartment deleted successfully", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         });

  //         // add the declined order to the declinedOrders array
  //         // const declinedOrder = orders.find((order) => order.id === appartId);
  //         // setDeclinedOrders([...declinedOrders, declinedOrder]);

  //         console.log(response.data); // handle response data
  //       })
  //       .catch((e) => {
  //         console.log(e.message); // handle error
  //         toast.error(
  //           "❌ An error occured while trying to delete the appartment!",
  //           {
  //             position: "top-right",
  //             autoClose: 2000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "light",
  //           }
  //         );
  //       })
  //       .finally(() => {
  //         setConfirmingDelete(false);
  //       });
  //   } else {
  //     setConfirmingDelete(true);
  //     setTimeout(() => {
  //       setConfirmingDelete(false);
  //     }, 3000);
  //   }
  // };
  const handleDelete = (appartId) => {
    Swal.fire({
      title: 'Sind Sie sicher?',
      text: 'Sie werden nicht in der Lage sein, diese Wohnung wiederherzustellen!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ja, löschen Sie es!',
      cancelButtonText: 'ABBRECHEN',
      confirmButtonClass: 'btn btn-danger',
    }).then((result) => {
      if (result.isConfirmed) {
        // The user confirmed, delete the appartment
        axios.delete(`http://localhost:9090/user/appartments/${appartId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const updatedAppartments = allAppartments.filter(
            (appart) => appart.id !== appartId
          );
          setAllAppartments(updatedAppartments);
          toast.success("✅ Appartment wurde erfolgreich gelöscht.", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          console.log(response.data); // handle response data
        })
        .catch((e) => {
          console.log(e.message); // handle error
          toast.error(
            "❌ Ein Fehler ist aufgetreten beim Versuch, die Wohnung zu löschen!",
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
        });
      }
    });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const updatedAppart = {
      name: name,
      description: description,
      pricePerNight: pricePerNight,
      location: location,
      rooms: rooms,
      rating: rating,
      type: type,
      services: services,
      img,
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

        toast.success("✅ Changes erfolgreich gespeichert.", {
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
        toast.error("❌ Es ist ein Fehler aufgetreten beim Versuch, die Änderungen zu speichern!", {
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
    setImg((prevImg) => [...prevImg, ""]);
  };

  const handleRemoveImageField = (index) => {
    setImg((prevImg) => prevImg.filter((item, i) => i !== index));
  };

  useEffect(() => {
    setName(appart.name);
    setDescription(appart.description);
    setPricePerNight(appart.pricePerNight);
    setLocation(appart.location);
    setRooms(appart.rooms);
    setRating(appart.rating);
    setType(appart.type);
    setImg(appart.img);
    setSrv(appart.services);
  }, [appart]);

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
        <td>{appart.rating}</td>
        <td className="d-flex justify-content-center">
          <div className="me-2">
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(appart.id)}
            >
              {confirmingDelete ? "✔️" : <FontAwesomeIcon icon={faTrash} />}
            </button>
          </div>
          <button
            className="btn btn-secondary me-2"
            onClick={handleShowEditModal}
          >
            <FontAwesomeIcon icon={faPencil} />
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleShowDetails(appart)}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
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
                placeholder="Name Eingeben"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              {nameError !== "" ? (
                <div className="invalid-feedback d-block">{nameError}</div>
              ) : null}
            </Form.Group>

            <Form.Group controlId="formPrice" className="col-6">
              <Form.Label>Preis pro Nacht</Form.Label>
              <Form.Control
                type="number"
                placeholder="Preis pro Nacht eingeben"
                value={pricePerNight}
                onChange={(event) => setPricePerNight(event.target.value)}
              />
              {priceError && (
                <div className="invalid-feedback d-block">{priceError}</div>
              )}
            </Form.Group>
            <Form.Group controlId="formDescription" className="col-12">
              <Form.Label>Beschreibung</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Beschreibung Eingeben"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              {descError && (
                <div className="invalid-feedback d-block">{descError}</div>
              )}
            </Form.Group>

            <Form.Group controlId="formLocation" className="col-6">
              <Form.Label>Ort</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ort eingeben"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
              />
              {locationError && (
                <div className="invalid-feedback d-block">{locationError}</div>
              )}
            </Form.Group>

            <Form.Group controlId="formType" className="col-6">
              <Form.Label>Typ</Form.Label>
              <Form.Control
                as="select"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="" selected>
                Wählen Sie den Typ aus
                </option>
                <option value="STANDARD">Standard</option>
                <option value="PREMIUM">Premium</option>
                <option value="LUXURY">Luxus</option>
              </Form.Control>
              {typeError && (
                <div className="invalid-feedback d-block">{typeError}</div>
              )}
            </Form.Group>

            <div className="col-6">
              <Form.Group controlId="formRooms">
                <Form.Label>Zimmer</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Anzahl der Zimmer eingeben"
                  value={rooms}
                  onChange={(event) => setRooms(event.target.value)}
                />
                {roomsError && (
                  <div className="invalid-feedback d-block">{roomsError}</div>
                )}
              </Form.Group>
              <Form.Group controlId="formRate">
                <Form.Label>Bewertung</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Rating eingeben"
                  value={rating}
                  onChange={(event) => setRating(event.target.value)}
                />
                {roomsError && (
                  <div className="invalid-feedback d-block">{roomsError}</div>
                )}
              </Form.Group>
            </div>

            <Form.Group controlId="services" className="col-6">
              <Form.Label>Dienstleistungen</Form.Label>
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
              <Form.Label>Bilder</Form.Label>
              {img.map((imgField, index) => (
                <div key={index} className="d-flex mb-2 align-items-center">
                  <Form.Control
                    type="url"
                    placeholder={`Bild-URL ${index + 1}`}
                    value={imgField}
                    onChange={(e) =>
                      setImg((prevImg) =>
                        prevImg.map((item, i) =>
                          i === index ? e.target.value : item
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
              Einreichen
            </Button>
          </Form>
          {/* add any other details here */}
        </Modal.Body>
      </Modal>
    </>
  );
}

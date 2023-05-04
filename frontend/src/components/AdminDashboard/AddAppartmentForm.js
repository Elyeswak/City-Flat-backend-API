import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import validator from "validator";
import "./AppartmentDash.css";

function AddApartmentForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
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
  const [imgCount, setImgCount] = useState(1);

  const handleSubmit = (event) => {
    event.preventDefault();
    //name field validation
    if (!name) {
      setNameError("❌ Please enter a name for the appartment.");
      toast.error("❌ Please enter a name for the appartment.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setNameError("");
      }, 3000);

      return;
    } else if (!validator.isAlpha(name.replace(/\s/g, ""))) {
      setNameError("❌ Name must contain only letters and spaces.");
      toast.error("❌ Name must contain only letters and spaces.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setNameError("");
      }, 3000);

      return;
    }
    //pricePerNight field validation
    if (!pricePerNight) {
      setPriceError("❌ Please enter a price per night for the appartment.");
      toast.error("❌ Please enter a price per night for the appartment.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setPriceError("");
      }, 3000);

      return;
    } else if (pricePerNight <= 0) {
      setPriceError("❌ Price per night value cannot be negative or zero");
      toast.error("❌ Price per night value cannot be negative or zero", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setPriceError("");
      }, 3000);

      return;
    }
    //description field validation
    if (!description) {
      setDescError("❌ Please enter a description for the appartment.");
      toast.error("❌ Please enter a description for the appartment.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setDescError("");
      }, 3000);

      return;
    } else if (description.length < 10) {
      setDescError("❌ Description value must be at least 10 characters long");
      toast.error("❌ Description value must be at least 10 characters long", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setDescError("");
      }, 3000);

      return;
    }
    //location field validation
    if (!location) {
      setLocationError("❌ Please enter a location for the appartment.");
      toast.error("❌ Please enter a location for the appartment.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setLocationError("");
      }, 3000);

      return;
    } else if (location.length < 5) {
      setLocationError("❌ Location value must be at least 5 characters long");
      toast.error("❌ Location value must be at least 5 characters long", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setLocationError("");
      }, 3000);

      return;
    }
    //type field validation
    if (type === "") {
      setTypeError("❌ Please select a type for the appartment.");
      toast.error("❌ Please select a type for the appartment.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setTypeError("");
      }, 3000);

      return;
    }
    //rooms field validation
    if (!rooms) {
      setRoomsError("❌ Please enter number of rooms for the appartment.");
      toast.error("❌ Please enter number of rooms for the appartment.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setRoomsError("");
      }, 3000);

      return;
    } else if (rooms <= 0) {
      setRoomsError("❌ Rooms value cannot be negative or zero");
      toast.error("❌ Rooms value cannot be negative or zero", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setRoomsError("");
      }, 3000);

      return;
    }
    //image field validation
    if (img === "") {
      setImageError("❌ Please choose an image for the appartment.");
      toast.error("❌ Please choose an image for the appartment.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      setTimeout(() => {
        setImageError("");
      }, 3000);

      return;
    }

    onSubmit({
      name,
      description,
      pricePerNight,
      location,
      type,
      rooms,
      rating,
      services,
      img,
    });

    // if (postSuccess) {
    //   setName("");
    //   setDescription("");
    //   setPricePerNight("");
    //   setLocation("");
    //   setRooms("");
    //   setType("");
    //   setImg("");
    //   setSrv([]);
    // }
  };

  useEffect(() => {
    // fetch all services
    axios
      .get(`http://localhost:9090/user/service/getAllServices`)
      .then((response) => {
        setFoundSrv(response.data);
      })
      .catch((error) => {
        // console.log(error);
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

  const handleAddImageField = () => {
    setImg((prevImg) => [...prevImg, ""]);
  };

  const handleRemoveImageField = (index) => {
    setImg((prevImg) => prevImg.filter((item, i) => i !== index));
  };

  return (
    <Form
      onSubmit={handleSubmit}
      className="row gy-3 text-start mx-auto mt-5 py-5"
      id="addAppartForm"
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
          <div key={index} className="d-flex mb-2 align-items-center">
            <Form.Control
              type="url"
              placeholder={`Image URL ${index + 1}`}
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

      <Button variant="primary" type="submit" className="w-25 mx-auto mt-3">
        Submit
      </Button>
    </Form>
  );
}

export default AddApartmentForm;

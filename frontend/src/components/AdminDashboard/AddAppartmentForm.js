import axios from "axios";
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";

function AddApartmentForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [location, setLocation] = useState("");
  const [rooms, setRooms] = useState("");
  const [type, setType] = useState("");
  const [img, setImg] = useState("");
  const [services, setSrv] = useState([]);
  const [foundSrv, setFoundSrv] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name,
      description,
      pricePerNight,
      location,
      type,
      rooms,
      services,
      img,
    });
  };

  useEffect(() => {
    // fetch all services
    axios
      .get(`http://localhost:9090/user/service/getAllServices`)
      .then((response) => {
        setFoundSrv(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <Form onSubmit={handleSubmit} className="row gy-3 text-start mx-auto mt-5 py-5">
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

      <Form.Group controlId="formLocation" className="col-6">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter location"
          value={location}
          onChange={(event) => setLocation(event.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="formType" className="col-6">
        <Form.Label>Type</Form.Label>
        <Form.Control
          as="select"
          value={type}
          onChange={(event) => setType(event.target.value)}
          required
        >
          <option value="" selected>Select type</option>
          <option value="STANDARD">Standard</option>
          <option value="PREMIUM">Premium</option>
          <option value="LUXURY">Luxury</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formRooms" className="col-6">
        <Form.Label>Rooms</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter number of rooms"
          value={rooms}
          onChange={(event) => setRooms(event.target.value)}
          required
        />
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

      <Form.Group controlId="formImg" className="col-12">
        <Form.Label>Image</Form.Label>
        <Form.Control
          type="file"
          placeholder="Enter image of appartment"
          value={img}
          onChange={(event) => setImg(event.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-25 mx-auto mt-3">
        Submit
      </Button>
    </Form>
  );
}

export default AddApartmentForm;

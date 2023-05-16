import { useState } from "react";
import { Form, Button } from "react-bootstrap";

function AddServiceForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name,
      description,
      pricePerNight,
    });
  };
  return (
    <Form
      onSubmit={handleSubmit}
      className="row gy-3 text-start mx-auto mt-5 py-5"
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
        <Form.Label>Preis pro Nacht</Form.Label>
        <Form.Control
          type="number"
          placeholder="Preis pro Nacht eingeben"
          value={pricePerNight}
          onChange={(event) => setPricePerNight(event.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formDescription" className="col-12">
        <Form.Label>Beschreibung</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Beschreibung eingeben"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-25 mx-auto mt-3">
      Hinzufügen
      </Button>
    </Form>
  );
}

export default AddServiceForm;

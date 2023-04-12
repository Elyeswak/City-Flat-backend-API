import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import emailjs from "@emailjs/browser";

function HelpRequest(props) {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");

  const handleClose = () => {
    setSubject("");
    setDetails("");
    props.onClose();
  };

  const handleSend = () => {
    const templateParams = {
      from_email: "client@cityflat.com",
      from_subject: subject,
      from_details: details,
    };
    emailjs
      .send(
        "service_5rl9i0i",
        "template_5ctdomr",
        templateParams,
        "mVe_wI_UrWCn4TF9U"
      )
      .then(
        (result) => {
          console.log("Email sent successfully!", result.text);
          handleClose();
        },
        (error) => {
          console.error("Failed to send email:", error);
        }
      );
    handleClose();
  };

  return (
    <Modal show={props.show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>REQUEST HELP FROM 24Bey</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="input1">
            <Form.Label>Request subject</Form.Label>
            <Form.Control
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="input2">
            <Form.Label>Request details</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="w-25">
          Cancel
        </Button>
        <Button variant="success" onClick={handleSend} className="w-25">
          Send
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HelpRequest;

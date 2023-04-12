import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import "./AccountPage.css";

function AccountPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const userToken = user.token;

 const [User, setUser] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(user.name);
 
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [number, setNumber] = useState(user.number);


  function handleShowModal() {
    setShowModal(true);
  }

  function handleSaveProfile() {
    // Define the updated user object
    const updatedUser = {
      name: name,
      email: email,
      number: number,
      address: address,
      token :userToken
    };
    // Make the Axios PUT request to update the user
    axios
      .put(`http://localhost:9090/user/${userId}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${userToken}`, // authentication is required
        },
      })
      .then((response) => {
        // Handle successful response
        console.log(response.data)
        const data = response.data ;
        data ["token"] = userToken;
        console.log(data)
        localStorage.setItem('user', JSON.stringify(data));
        setShowModal(false);
        
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  }


  return (
    <div>
      <Navbar />
      <section style={{ backgroundColor: "#000" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb- color-white">
                <div className="card-body text-center">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
                    alt="avatar"
                    className="rounded-circle img-fluid"
                    style={{ width: 150 }}
                  />
                  <h5 className="my-3">{user.name}</h5>
                  
                  <p className="text-muted mb-4">{user.address}</p>
                  <div className="d-flex justify-content-center mb-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary ms-1 edit-profile"
                      onClick={handleShowModal}
                    >
                      EDIT MY PROFILE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Profile</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPhone">
                    <Form.Label>Phone Number</Form.Label>

                    <PhoneInput
                      id="number"
                      name="number"
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder={`+${user.number}`}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={user.address}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSaveProfile}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            <div className="col-lg-8">
              <div className="card mb-4 color-white">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Full Name</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{user.name}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Email</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{user.email}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Phone</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">+{user.number}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">Address</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">
                        {user.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="card mb-4 mb-md-0 color-white">
                    <div className="card-body">
                      <p className="mb-4">My orders</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card mb-4 mb-md-0 color-white">
                    <div className="card-body">
                      <p className="mb-4">My reservations</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default AccountPage;

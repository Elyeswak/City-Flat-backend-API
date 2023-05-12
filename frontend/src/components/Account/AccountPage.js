import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";
import Table from "react-bootstrap/Table";
import moment from "moment";
import Badge from "react-bootstrap/Badge";
import validator from "validator";
import { isValidNumber } from "libphonenumber-js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountPage.css";
import { Cloudinary } from "@cloudinary/base";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next";


function AccountPage() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const userToken = user.token;
  const { t } = useTranslation();

  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address);
  const [number, setNumber] = useState(user.number);
  const [img, setImg] = useState(user.img);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isValidPhoneNumber, setIsValidNumber] = useState(false);
  const [isValidName, setIsValidName] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);

  //edit img modal
  const [showEditImg, setShowEditImg] = useState(false);
  const handleCloseEditImg = () => setShowEditImg(false);
  const handleShowEditImg = () => setShowEditImg(true);
  const cloudinary = new Cloudinary({
    cloud: {
      cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.REACT_APP_CLOUDINARY_KEY,
    },
  });

  const [imageUrl, setImageUrl] = useState("");
  const [imageUrl2, setImageUrl2] = useState("");

  const handleImageUrlChange = (e) => {
    setImageUrl2(e.target.value);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setImageUrl(file);
  };



  const handleSaveChanges = async () => {
    if (imageUrl) {
      await axios.delete(
        `http://localhost:9090/delete-from-cloudinary/${userId}`
      );
      try {

        // Delete all files with userId in their names

        const formData = new FormData();
        formData.append("file", imageUrl);
        formData.append("upload_preset", "k0vttmaf");
        formData.append("public_id", `${userId},${Date.now()}`);
        formData.append("folder", "CityFlat-assets/profile_imgs");
        formData.append("api_key", process.env.REACT_APP_CLOUDINARY_KEY);

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${cloudinary.cloudinaryConfig.cloud.cloudName}/image/upload`,
          formData
        );

        const uploadedImageUrl = response.data.secure_url;
        setImageUrl(uploadedImageUrl);
        setImg(uploadedImageUrl);
        // Do something with the uploaded image URL
        try {
          const response = await axios.put(
            `http://localhost:9090/user/${userId}`,
            {
              img: uploadedImageUrl,
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`, // authentication is required
              },
            }
          );
          setImageUrl2("");
          setImg(uploadedImageUrl);
          // Update the img property of the user object
          user.img = uploadedImageUrl;

          // Stringify the updated user object
          const updatedUserObject = JSON.stringify(user);

          // Store the updated user object back in local storage
          localStorage.setItem("user", updatedUserObject);
        } catch (error) {
          console.log("while trying to submit imageUrl2", error);
        }
      } catch (error) {
        console.log(error);
      }
    }

    if (imageUrl2) {
      try {
        const response = await axios.put(
          `http://localhost:9090/user/${userId}`,
          {
            img: imageUrl2,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`, // authentication is required
            },
          }
        );
        setImg(imageUrl2);
        // Update the img property of the user object
        user.img = imageUrl2;

        // Stringify the updated user object
        const updatedUserObject = JSON.stringify(user);

        // Store the updated user object back in local storage
        localStorage.setItem("user", updatedUserObject);
      } catch (error) {
        console.log("while trying to submit imageUrl2", error);
      }
    }
    handleCloseEditImg();
  };

  //edit img modal

  /**CHECK FOR PASSWORD VISIBILTY */
  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
    setIsValidName(
      /^[a-zA-Z\s'"]+$/.test(name) && name.length < 50 && name.length > 5
    );
  };

  const onChangeNumber = (e) => {
    const number = document.getElementById("number").value;
    setNumber(number);
    setIsValidNumber(isValidNumber(number));
  };

  const onChangeOldPassword = (e) => {
    const oldPassword = e.target.value;
    setOldPassword(oldPassword);
  };
  const onChangeNewPassword = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setIsValidPassword(
      validator.isStrongPassword(newPassword) && /^\S+$/.test(newPassword)
    );
  };
  function handleShowModal() {
    setShowModal(true);
  }

  function handleShowPasswordModal() {
    setShowPasswordModal(true);
  }

  /**UPDATE PASSWORD*/
  const handlePasswordChange = async (event) => {
    event.preventDefault(); // prevent form submission

    if (!oldPassword || !newPassword) {
      toast.error("❌ Please fill all required fields!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!isValidPassword) {
      toast.error(
        "❌ Your password should contain a minimum of 8 characters, including at least one lowercase letter, one uppercase letter, one number, and one symbol.",
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
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9090/user/reset/${user.email}`,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // authentication is required
          },
        }
      );
      toast.success("✔️ Password updated successfully!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setShowPasswordModal(false);
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to update password!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  /**UPDATE PROFILE */
  const handleSaveProfile = async (event) => {
    event.preventDefault(); // prevent form submission

    if (!name || !number || !address) {
      toast.error("❌ Please fill all required fields!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    if (!/^[a-zA-Z0-9,\s]{6,50}$/.test(address)) {
      toast.error(
        "❌ Invalid address! Address should only contain alphanumeric characters and spaces and be between 6 to 50 characters long.",
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
      return;
    }

    const phoneNumber = number.replace("+", "");
    const Number = phoneNumber.replace(/\s/g, "");

    try {
      const response = await axios.put(
        `http://localhost:9090/user/${userId}`,
        {
          name: name,
          number: Number,
          address: address,
          token: userToken,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // authentication is required
          },
        }
      );
      const data = response.data;
      data["token"] = userToken;
      localStorage.setItem("user", JSON.stringify(data));
      setShowModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  /**GET ALL RESERVATION FOR THE LOGGEDIN USER */
  useEffect(() => {
    axios
      .get("http://localhost:9090/user/reservations/getallmy", {
        headers: {
          Authorization: `Bearer ${userToken}`, // if authentication is required
        },
      })
      .then((response) => {
        setReservations(response.data);
      })
      .catch((error) => {
      });
  }, []);

  /**GET ALL ORDERS FOR THE LOGGEDIN USER */
  useEffect(() => {
    axios
      .get("http://localhost:9090/user/orders/GetallUO", {
        headers: {
          Authorization: `Bearer ${userToken}`, // if authentication is required
        },
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
      });
  }, []);

  return (
    <div>
      <Navbar />
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
      <section style={{ backgroundColor: "#000" }}>
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-4">
              <div className="card mb- color-white">
                <div className="card-body text-center">
                  <div className="profile-img-container">
                    <img
                      src={img}
                      alt="avatar"
                      className="rounded-circle img-fluid profile-img"
                      style={{ width: 150, height: 150 }}
                    />
                    <div class="camera-icon" onClick={handleShowEditImg}></div>
                  </div>
                  <h5 className="my-3">{user.name}</h5>

                  <p className="text-muted mb-4">{user.address}</p>
                  <div className="d-flex justify-content-center mb-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary ms-1 edit-profile"
                      onClick={handleShowModal}
                    >
                      {t("EDIT MY PROFILE")}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-primary ms-1 edit-profile"
                      onClick={handleShowPasswordModal}
                    >
                      {t("EDIT MY PASSWORD")}
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
                    <Form.Label>{t("Full Name")}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Your Name"
                      value={name}
                      onChange={onChangeName}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPhone">
                    <Form.Label>{t("Phone Number")}</Form.Label>

                    <PhoneInput
                      id="number"
                      name="number"
                      value={number}
                      onChange={onChangeNumber}
                      placeholder={`+${user.number}`}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicAddress">
                    <Form.Label>{t("Address")}</Form.Label>
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
                  {t("Close")}
                </Button>
                <Button variant="primary" onClick={handleSaveProfile}>
                  {t("Save Changes")}
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal
              show={showPasswordModal}
              onHide={() => setShowPasswordModal(false)}
            >
              <Modal.Header closeButton>
                <Modal.Title>{t("Edit Password")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicOldPassword">
                    <Form.Label>{t("Old Password")}</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder={t("Enter your old password")}
                      value={oldPassword}
                      onChange={onChangeOldPassword}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicNewPassword">
                    <Form.Label>{t("New Password")}</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder={t("Set new password")}
                      value={newPassword}
                      onChange={onChangeNewPassword}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordModal(false)}
                >
                  {t("Close")}
                </Button>
                <Button variant="primary" onClick={handlePasswordChange}>
                  {t("Save Changes")}
                </Button>
              </Modal.Footer>
            </Modal>

            <Modal show={showEditImg} onHide={handleCloseEditImg}>
              <Modal.Header closeButton>
                <Modal.Title>{t("Edit Profile Image")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group className="mb-3" controlId="imageUrl">
                    <Form.Label>{t("Image Url")}</Form.Label>
                    <Form.Control
                      type="url"
                      value={imageUrl2}
                      onChange={handleImageUrlChange}
                      autoFocus
                    />
                  </Form.Group>
                  <Form.Label>{t("Or")}</Form.Label>
                  <Form.Group className="mb-3" controlId="file">
                    <Form.Label>{t("Upload Local Image")}</Form.Label>
                    <Form.Control type="file" onChange={handleFileChange} />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseEditImg}>
                  {t("Close")}
                </Button>
                <Button variant="primary" onClick={handleSaveChanges}>
                  {t("Save Changes")}
                </Button>
              </Modal.Footer>
            </Modal>

            <div className="col-lg-8">
              <div className="card mb-4 color-white">
                <div className="card-body">
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">{t("Full Name")}</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{user.name}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">{t("Email")}</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{user.email}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">{t("Phone Number")}</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{user.number}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-sm-3">
                      <p className="mb-0">{t("Address")}</p>
                    </div>
                    <div className="col-sm-9">
                      <p className="text-muted mb-0">{user.address}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="card mb-4 mb-md-0 color-white">
                    <div className="card-body">
                      <p className="mb-4">{t("My orders")}</p>
                      <Table responsive className="reservations_table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>{t("Apartment")}</th>
                            <th>{t("Date")}</th>
                            <th>{t("Total price")}</th>
                            <th>{t("Status")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{order.appartment.name}</td>
                              <td>
                                {moment(order.createdAt).format("DD MMMM YYYY")}
                              </td>
                              <td>€ {order.totalPrice}</td>
                              <td>
                                {order.state === "PENDING" && (
                                  <div>
                                    <Badge bg="warning" pill text="dark">
                                      {t("PENDING")}
                                    </Badge>
                                  </div>
                                )}
                                {order.state === "ACCEPTED" && (
                                  <div>
                                    <div className="badge_status"></div>
                                    <div className="pay_btn"></div>
                                    <Badge bg="success" pill text="dark">
                                      {t("ACCEPTED")}
                                    </Badge>
                                  </div>
                                )}
                                {order.state === "DECLINED" && (
                                  <div>
                                    <Badge bg="danger" pill text="dark">
                                      {t("DECLINED")}
                                    </Badge>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card mb-4 mb-md-0 color-white">
                    <div className="card-body">
                      <p className="mb-4">{t("My reservations")}</p>
                      <Table responsive className="reservations_table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>{t("Reservation code")}</th>
                            <th>{t("Date")}</th>
                            <th>{t("Total price")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reservations.map((reservation, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{reservation.code}</td>
                              <td>
                                {moment(reservation.createdAt).format(
                                  "DD MMMM YYYY"
                                )}
                              </td>
                              <td>€ {reservation.Order.totalPrice}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
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

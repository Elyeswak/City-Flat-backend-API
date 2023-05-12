import React, { useEffect, useState } from "react";
import "./OrderDash.css";
import Table from "react-bootstrap/Table";
import moment from "moment";
import axios from "axios";
import Sidebar from "./Sidebar";
import OrderDetailsModal from "./OrderDetailsModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faCheck,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

export default function OrdersDash() {
  const [orders, setOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [declinedOrders, setDeclinedOrders] = useState([]);
  const [acceptedOrdersUpdated, setAcceptedOrdersUpdated] = useState(null);

  const [User, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `http://localhost:9090/user/${User.id}`
        );
        const user = response.data;
        setIsAdmin(user.role === "ADMIN");
      } catch (error) {
        console.error(error);
      }
    }

    if (User) {
      getUser();
    }
  }, [User]);

  /**GET ALL ORDERS FOR THE LOGGED IN USER */
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  useEffect(() => {
    axios
      .get("http://localhost:9090/user/orders/Getall", {
        headers: {
          Authorization: `Bearer ${token}`, // if authentication is required
        },
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch(() => {
        console.log("error"); // handle error
      });
  }, [acceptedOrdersUpdated]);

  const [confirmingAccept, setConfirmingAccept] = useState(false);
  const [confirmingDecline, setConfirmingDecline] = useState(false);

  const handleDecline = (orderId) => {
    if (confirmingDecline) {
      Swal.fire({
        title: "Sind Sie sicher, dass Sie die Buchungsanfrage ablehnen möchten?",
        text: "Sie werden dies nicht rückgängig machen können!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        confirmButtonText: "Ja, ablehnen!",
        cancelButtonColor: "#3085d6",
        cancelButtonText: "Nein, behalte es.",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(
              `http://localhost:9090/user/order/adminDecline/${orderId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
            .then((response) => {
              // remove the declined order from the orders array
              const updatedOrders = orders.filter(
                (order) => order.id !== orderId
              );
              setOrders(updatedOrders);

              // add the declined order to the declinedOrders array
              // const declinedOrder = orders.find((order) => order.id === orderId);
              // setDeclinedOrders([...declinedOrders, declinedOrder]);

              console.log(response.data); // handle response data
            })
            .catch((e) => {
              console.log(e.message); // handle error
            })
            .finally(() => {
              setConfirmingDecline(false);
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          setConfirmingDecline(false);
        }
      });
    } else {
      setConfirmingDecline(true);
      setTimeout(() => {
        setConfirmingDecline(false);
      }, 3000);
    }
  };

  const handleAccept = (orderId) => {
    if (confirmingAccept) {
      axios
        .post(`http://localhost:9090/user/order/accept/${orderId}`, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // remove the accepted order from the orders array
          const acceptedOrder = orders.find((order) => order.id === orderId);
          setAcceptedOrders([...acceptedOrders, acceptedOrder]);
          const acceptedOrdersUpdated = new Date();
          setAcceptedOrdersUpdated(acceptedOrdersUpdated);
        })
        .catch((e) => {
          console.log(e.message); // handle error
        })
        .finally(() => {
          setConfirmingAccept(false);
        });
    } else {
      Swal.fire({
        title: "Sind Sie sicher, dass Sie diese Buchungsanfrage annehmen möchten?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText :"Stornieren",
        confirmButtonText: "Akzeptieren",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(`http://localhost:9090/user/order/accept/${orderId}`, null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((response) => {
              // remove the accepted order from the orders array
              const acceptedOrder = orders.find((order) => order.id === orderId);
              setAcceptedOrders([...acceptedOrders, acceptedOrder]);
              const acceptedOrdersUpdated = new Date();
              setAcceptedOrdersUpdated(acceptedOrdersUpdated);
              console.log(response.data); // handle response data
            })
            .catch((e) => {
              console.log(e.message); // handle error
            })
            .finally(() => {
              setConfirmingAccept(false);
            });
        }
      });
      setConfirmingAccept(true);
      setTimeout(() => {
        setConfirmingAccept(false);
      }, 3000);
    }
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  return (
    <>
      {isAdmin ? (
        <div className="orders__page bg-dark">
          <Sidebar />

          <div className="orders_page_content">
            <h1 className="text-light text-center mt-5">Dashboard für Buchungsanfragen</h1>
            <div className="orders_table">
              <Table responsive className="orders_table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Apartment</th>
                    <th>Einchecken</th>
                    <th>Auschecken</th>
                    <th>Gesamtpreis</th>
                    <th>Status</th>
                    <th colSpan={3}>Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {orders &&
                    orders.map((order, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{order.appartment.name}</td>
                        <td>{moment(order.checkIn).format("DD MMMM YYYY")}</td>
                        <td>{moment(order.checkOut).format("DD MMMM YYYY")}</td>
                        <td>€ {order.totalPrice}</td>
                        {order.state === "ACCEPTED" ? (
                          <td colSpan={2}>
                            <div className="text-success">Akzeptiert</div>
                          </td>
                        ) : (
                          <>
                            <td colSpan={2}>
                              <div>
                                <div
                                  style={{
                                    display: "inline-block",
                                    marginRight: "2px",
                                  }}
                                >
                                  {order.state === "DECLINED" ? null : (
                                    <button
                                      className="btn btn-success rounded-pill"
                                      disabled={order.state === "DECLINED"}
                                      onClick={() => handleAccept(order.id)}
                                    >
                                      <FontAwesomeIcon icon={faCheck} />
                                    </button>
                                  )}
                                </div>

                                <div
                                  style={{
                                    display: "inline-block",
                                    marginLeft: "2px",
                                  }}
                                >
                                  {order.state === "DECLINED" ? (
                                    <p className="text-danger">Abgelehnt</p>
                                  ) : (
                                    <button
                                      className="btn btn-danger rounded-pill"
                                      onClick={() => handleDecline(order.id)}
                                    >
                                      <FontAwesomeIcon icon={faCancel} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>
                          </>
                        )}
                        <td>
                          <button
                            className="btn btn-warning rounded-pill ml-2"
                            onClick={() => handleShowDetails(order)}
                          >
                            <FontAwesomeIcon icon={faInfoCircle}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            {selectedOrder && (
              <OrderDetailsModal
                order={selectedOrder}
                show={showModal}
                handleClose={handleCloseModal}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="div-denied d-flex align-items-center justify-content-center">
          <h1 className="text-center display-1">⚠️ 404 NOT FOUND</h1>
        </div>
      )}
    </>
  );
}

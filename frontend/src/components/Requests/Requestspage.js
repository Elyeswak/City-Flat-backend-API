import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./RequestsPage.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import { format } from "date-fns";
import Swal from "sweetalert2";
import moment from "moment";
import Badge from "react-bootstrap/Badge";
import axios from "axios";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCancel,
  faCreditCardAlt,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";

function RequestsPage() {
  const [orders, setOrders] = useState([]);

  /**GET ALL ORDERS FOR THE LOGGED IN USER */
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;

  useEffect(() => {
    axios
      .get("http://localhost:9090/user/orders/GetallUO", {
        headers: {
          Authorization: `Bearer ${token}`, // if authentication is required
        },
      })
      .then((response) => {
        setOrders(response.data);
        console.log(response.data); // handle response data
      })
      .catch((error) => {
        console.log(error.response.data); // handle error
      });
  }, []);

  /**CLICK TO PAY*/
  function handlePayNowClick(e, order) {
    e.preventDefault();
    const orderId = order.id;
    localStorage.setItem("orderId", orderId);
    // redirect to payment page
    window.location.href = "/paynow";
  }

  /**CANCEL/DELETE AN ORDER */
  function handleCancelClick(orderId) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios
            .delete(
              `http://localhost:9090/user/reservations/decline/${orderId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`, // if authentication is required
                },
              }
            )
            .then((response) => {
              console.log(response.data);
              // Update the orders array in state to remove the deleted order
              setOrders(orders.filter((order) => order._id !== orderId));
              // Retrieve the updated list of orders from the server
              axios
                .get("http://localhost:9090/user/orders/GetallUO", {
                  headers: {
                    Authorization: `Bearer ${token}`, // if authentication is required
                  },
                })
                .then((response) => {
                  setOrders(response.data);
                  console.log(response.data); // handle response data
                })
                .catch((error) => {
                  console.log(error.response.data); // handle error
                });
            })
            .catch((error) => {
              console.log(error);
            });

          // Show success message after deleting the order
          Swal.fire("Deleted!", "Your order has been canceled.", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // Show cancel message
          Swal.fire("Cancelled", "Your order is safe :)", "error");
        }
      });
  }

  return (
    <div className="requests__page">
      <Navbar />
      <div className="upper__space"></div>
      <div className="requests_page_content">
        <div className="requests_table">
          <Table responsive className="requests_table">
            <thead>
              <tr>
                <th>#</th>
                <th>Apartment</th>
                <th>Booking Date</th>
                <th>check-in</th>
                <th>check-out</th>
                <th>Total price</th>
                <th>Order status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order.appartment.name}</td>
                  <td>{moment(order.createdAt).format("DD MMMM YYYY")}</td>
                  <td>{moment(order.checkIn).format("DD MMMM YYYY")}</td>
                  <td>{moment(order.checkOut).format("DD MMMM YYYY")}</td>
                  <td>€ {order.totalPrice}</td>
                  <td>
                    {order.state === "PENDING" && (
                      <div>
                        <Badge bg="warning" pill text="dark">
                          PENDING
                        </Badge>
                      </div>
                    )}
                    {order.state === "ACCEPTED" && (
                      <div>
                        <Badge bg="success" pill text="dark">
                          ACCEPTED
                        </Badge>
                      </div>
                    )}
                    {order.state === "DECLINED" && (
                      <div>
                        <Badge bg="danger" pill text="dark">
                          DECLINED
                        </Badge>
                      </div>
                    )}
                  </td>
                  <td>
                    {order.state === "PENDING" && (
                      <div>
                        <button
                          type="button"
                          className="btn"
                          style={{
                            backgroundColor: "#c41d1d",
                            borderRadius: "50%",
                            fontSize: "12px",
                          }}
                          onClick={() => handleCancelClick(order.id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{ color: "white" }}
                          />
                        </button>
                      </div>
                    )}
                    {order.state === "ACCEPTED" && (
                      <div>
                        <button
                          type="button"
                          className="btn"
                          style={{
                            backgroundColor: "#1912cc",
                            borderRadius: "50%",
                            fontSize: "12px",
                          }}
                          onClick={(e) => handlePayNowClick(e, order)}
                        >
                          <FontAwesomeIcon
                            icon={faCreditCardAlt}
                            style={{ color: "white" }}
                          />
                        </button>

                        <a
                          style={{
                            marginLeft: "3%",
                          }}
                          onClick={() => handleCancelClick(order.id)}
                        >
                          <span>CANCEL</span>
                        </a>
                      </div>
                    )}
                    {order.state === "DECLINED" && (
                      <div>
                        <button
                          type="button"
                          className="btn"
                          style={{
                            backgroundColor: "#c41d1d",
                            borderRadius: "50%",
                            fontSize: "12px",
                          }}
                          onClick={() => handleCancelClick(order.id)}
                        >
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{ color: "white" }}
                          />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RequestsPage;

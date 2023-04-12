import React, { useEffect, useState } from "react";
import "./OrderDash.css";
import Table from "react-bootstrap/Table";
import moment from "moment";
import axios from "axios";
import Sidebar from "./Sidebar";
import OrderDetailsModal from "./OrderDetailsModal";

export default function OrdersDash() {
  const [orders, setOrders] = useState([]);
  const [AcceptedOrders, setAcceptedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [declinedOrders, setDeclinedOrders] = useState([]);
  const [acceptedOrdersUpdated, setAcceptedOrdersUpdated] = useState(null);

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
        console.log(response.data); // handle response data
      })
      .catch(() => {
        console.log("error"); // handle error
      });
  }, [acceptedOrdersUpdated]);

  const handleDecline = (orderId) => {
    axios
      .delete(`http://localhost:9090/user/order/adminDecline/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // remove the declined order from the orders array
        const updatedOrders = orders.filter((order) => order.id !== orderId);
        setOrders(updatedOrders);

        // add the declined order to the declinedOrders array
        // const declinedOrder = orders.find((order) => order.id === orderId);
        // setDeclinedOrders([...declinedOrders, declinedOrder]);

        console.log(response.data); // handle response data
      })
      .catch((e) => {
        console.log(e.message); // handle error
      });
  };

  const handleAccept = (orderId) => {
    axios
      .post(`http://localhost:9090/user/order/accept/${orderId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // remove the accepted order from the orders array
        const acceptedOrder = orders.find((order) => order.id === orderId);
        setAcceptedOrders([...AcceptedOrders, acceptedOrder]);
        const acceptedOrdersUpdated = new Date();
        setAcceptedOrdersUpdated(acceptedOrdersUpdated);
        console.log(response.data); // handle response data
      })
      .catch((e) => {
        console.log(e.message); // handle error
      });
  };

  const handleShowDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  console.log(selectedOrder);

  return (
    <div className="orders__page">
      <Sidebar />

      <div className="orders_page_content">
        <div className="orders_table">
          <Table responsive className="orders_table">
            <thead>
              <tr>
                <th>#</th>
                <th>Apartment</th>
                <th>check-in</th>
                <th>check-out</th>
                <th>Total price</th>
                <th colSpan={3}>Order action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{order.appartment.name}</td>
                  <td>{moment(order.checkIn).format("DD MMMM YYYY")}</td>
                  <td>{moment(order.checkOut).format("DD MMMM YYYY")}</td>
                  <td>€ {order.totalPrice}</td>
                  {order.state === "ACCEPTED" ? (
                    <td colSpan={2}>
                      <div className="text-success">Accepted</div>
                    </td>
                  ) : (
                    <td>
                      <div>
                        <button
                          className="btn btn-success rounded-pill"
                          disabled={order.state === "DECLINED"}
                          onClick={() => handleAccept(order.id)}
                        >
                          Accept
                        </button>
                      </div>
                    </td>
                  )}
                  {order.state === "ACCEPTED" ? null : (
                    <td>
                      <div>
                        <button
                          className="btn btn-danger rounded-pill"
                          onClick={() => handleDecline(order.id)}
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  )}
                  <td>
                    <button
                      className="btn btn-info rounded-pill ml-2"
                      onClick={() => handleShowDetails(order)}
                    >
                      Details
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
  );
}

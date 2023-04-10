import React from "react";
import React, { useEffect, useState } from "react";
import "./OrderDash.css";
import Table from "react-bootstrap/Table";
import moment from "moment";
import axios from "axios";
export default function OrdersDash() {
  

  const [orders, setOrders] = useState([]);

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
  }, []);

  const handleDecline = (orderId) => {
    axios
      .delete(`http://localhost:9090/user/order/adminDecline/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        // remove the deleted order from the orders array
        const updatedOrders = orders.filter((order) => order.id !== orderId);
        setOrders(updatedOrders);
        console.log(response.data); // handle response data
      })
      .catch((e) => {
        console.log(e.message); // handle error
      });
  };

  return (
        <div className="orders__page">
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
                    <th colSpan={2}>Order action</th>
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
                      <td>
                        <div>
                          <button className="btn btn-success rounded-pill">
                            Accept
                          </button>
                        </div>
                      </td>
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
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      
  );
}

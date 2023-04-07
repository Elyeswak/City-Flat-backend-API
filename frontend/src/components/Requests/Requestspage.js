import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import "./RequestsPage.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import { format } from "date-fns";
import moment from "moment";
import Badge from "react-bootstrap/Badge";
import axios from "axios";

function RequestsPage() {
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
      .catch((error) => {
        console.log(error.response.data); // handle error
      });
  }, []);

  function handlePayNowClick(e, order) {
    e.preventDefault();
    const orderId = order.id;
    localStorage.setItem("orderId", orderId);
    // redirect to payment page
    window.location.href = "/paynow";
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
                <th>check-in</th>
                <th>check-out</th>
                <th>Total price</th>
                <th>Order status</th>
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
                    {order.state === "PENDING" && (
                      <div>
                        <Badge bg="warning" pill text="dark">
                          PENDING
                        </Badge>
                        <a href="/" class="link link--metis">
                          <span>CANCEL</span>
                        </a>
                      </div>
                    )}
                    {order.state === "ACCEPTED" && (
                      <div>
                        <div className="badge_status"></div>
                        <div className="pay_btn"></div>
                        <Badge bg="success" pill text="dark">
                          ACCEPTED
                        </Badge>
                        <a
                          href="#"
                          class="link link--metis pay-now"
                          onClick={(e) => handlePayNowClick(e, order)}
                        >
                          <span>PAY NOW</span>
                        </a>
                      </div>
                    )}
                    {order.state === "DECLINED" && (
                      <div>
                        <Badge bg="danger" pill text="dark">
                          DECLINED
                        </Badge>
                        <a href="/" class="link link--metis">
                          <span>DELETE</span>
                        </a>
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

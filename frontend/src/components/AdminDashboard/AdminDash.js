import React, { useEffect, useState } from "react";
import "./AdminDash.css";
import Table from "react-bootstrap/Table";
import moment from "moment";
import Badge from "react-bootstrap/Badge";
import axios from "axios";

export default function AdminDash() {
  const [User, setUser] = useState(null);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const isAdmin = User && User.role === "ADMIN";

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

  const [appartments, setAppartments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/appartments/getAllAppart")
      .then((result) => {
        setAppartments(result.data);
      })
      .catch((error) => console.log(error));
  }, []);

  let objectWithName = null;

  const getAppartName = (ordId) => {
    objectWithName = appartments.find((obj) => obj.id === ordId);
    return objectWithName ? objectWithName.name : "Loading ...";
  };

  return (
    <>
      {isAdmin ? (
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
                    <th>Order status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{getAppartName(order.appartment)}</td>
                      <td>{moment(order.checkIn).format("DD MMMM YYYY")}</td>
                      <td>{moment(order.checkOut).format("DD MMMM YYYY")}</td>
                      <td>€ {order.totalPrice}</td>
                      <td>
                        {order.state === "PENDING" && (
                          <div>
                            <Badge bg="warning" pill text="dark">
                              PENDING
                            </Badge>
                            <a href="/" className="link link--metis">
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
                            <a href="/paynow" className="link link--metis">
                              <span>PAY NOW</span>
                            </a>
                          </div>
                        )}
                        {order.state === "DECLINED" && (
                          <div>
                            <Badge bg="danger" pill text="dark">
                              DECLINED
                            </Badge>
                            <a href="/" className="link link--metis">
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
        </div>
      ) : (
        <div className="div-denied bg-dark d-flex align-items-center justify-content-center">
          <h1 className="text-warning text-center display-1">
            ⚠️ access denied !!!
          </h1>
        </div>
      )}
    </>
  );
}

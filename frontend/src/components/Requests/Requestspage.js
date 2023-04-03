import React from "react";
import Table from "react-bootstrap/Table";
import "./RequestsPage.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";

import Badge from "react-bootstrap/Badge";

function RequestsPage() {
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
                <th>Date</th>
                <th>check-in</th>
                <th>check-out</th>
                <th>Total price</th>
                <th>Order status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>
                  <div>
                    <Badge bg="warning" text="dark">
                      PENDING
                    </Badge>{" "}
                  </div>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
              </tr>
              <tr>
                <td>3</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RequestsPage;

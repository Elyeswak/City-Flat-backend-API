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
                    <Badge bg="warning" pill text="dark">
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
                <td>
                  <div>
                    <div className="badge_status"></div>
                    <div className="pay_btn"></div>
                    <Badge bg="success" pill text="dark">
                      ACCEPTED
                    </Badge>
                    <a href="/paynow" class="link  link--metis"><span>PAY</span></a>
                  </div>
                </td>
              </tr>
              <tr>
                <td>3</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>Table cell</td>
                <td>
                  <div>
                    <Badge bg="danger" pill text="dark">
                      DECLINED
                    </Badge>{" "}
                  </div>
                </td>
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

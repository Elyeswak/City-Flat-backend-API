import React from "react";
import Table from "react-bootstrap/Table";
import "./Requestspage.css";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";

function Requestspage() {
  return (
    <div className="requests__page">
      <Navbar />
      <div className="upper__space"></div>
      <div className="requests_page_content">
        <div className="requests_table">
          <Table responsive style={{ color: "white" }}>
            <thead>
              <tr>
                <th>#</th>
                {Array.from({ length: 4 }).map((_, index) => (
                  <th key={index}>Table heading</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                {Array.from({ length: 4 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
              <tr>
                <td>2</td>
                {Array.from({ length: 4 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
              <tr>
                <td>3</td>
                {Array.from({ length: 4 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default Requestspage;

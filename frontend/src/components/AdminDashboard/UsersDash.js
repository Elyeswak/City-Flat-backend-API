import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./UsersDash.css";
import { ToastContainer } from "react-toastify";
import { Table } from "react-bootstrap";
import AllUserssRow from "./AllUserssRow";
import axios from "axios";

export default function UsersDash() {
  const [filterValue, setFilterValue] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  let filteredAllUsers = [];

  useEffect(() => {
    axios
      .get(`http://localhost:9090/user/`)
      .then((response) => {
        setAllUsers(response.data);
      })
      .catch((error) => {
        console.log(error);
        // toast.error("❌ An error occured while trynig to get appartments!", {
        //   position: "top-right",
        //   autoClose: 2000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        // });
      });
  }, []);

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setFilterValue(filter);
  };
  if (filterValue === "") {
    filteredAllUsers = allUsers;
  }
  if (filterValue === "inactive") {
    filteredAllUsers = allUsers.filter(
      (userInactive) => userInactive.isVerified === false
    );
    console.log(filterValue);
    console.log(filteredAllUsers);
  }
  if (filterValue === "active") {
    filteredAllUsers = allUsers.filter(
      (userActive) => userActive.isVerified === true
    );
    console.log(filterValue);
    console.log(filteredAllUsers);
  }
  return (
    <div className="bg-dark userDashContainer">
      <Sidebar />
      <div className="w-100">
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
        <Table responsive className="text-light">
          <thead>
            <tr>
              <th colSpan={3}></th>
              <th colSpan={1}></th>
              <th colSpan={2}>
                <div className="d-flex justify-content-end">
                  <select
                    class="form-control"
                    aria-label="Default select example"
                    onChange={handleFilterChange}
                  >
                    <option selected value="">
                      {filterValue === "" ? "Filter" : "Reset"}
                    </option>
                    <optgroup label="ACCOUNT STATE">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </optgroup>
                  </select>
                </div>
              </th>
            </tr>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th colSpan={2}>User action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAllUsers.map((usr, index) => (
              <AllUserssRow
                usr={usr}
                index={index}
                allUsers={filteredAllUsers}
                setAllUsers={setAllUsers}
              />
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

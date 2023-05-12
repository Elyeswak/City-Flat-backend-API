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
        console.log("returned user from db", user);
        setIsAdmin(user.role === "ADMIN");
      } catch (error) {
        console.error(error);
      }
    }

    if (User) {
      getUser();
    }
  }, [User]);

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
  let filteredAllUsers = [];
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
    <>
      {isAdmin ? (
        <div className="bg-dark userDashContainer">
          <Sidebar />
          <h1 className="text-light text-center pt-5">Benutzer-Dashboard</h1>
          <div className="dash-table">
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
                  <th colSpan={5}></th>
                  <th>
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
                          <option value="active">Aktiv</option>
                          <option value="inactive">Inaktiv</option>
                        </optgroup>
                      </select>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>E-MAIL</th>
                  <th>Telefonnummer</th>
                  <th>Zustand </th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredAllUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <p className="text-light text-center">
                      Keine übereinstimmenden Benutzer gefunden
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredAllUsers.map((usr, index) => {
                    console.log("user to be displayed", usr); // <-- add this line
                    console.log("all users array", allUsers);
                    console.log("filtered users", filteredAllUsers);
                    console.log("filter value", filterValue);
                    return (
                      <AllUserssRow
                        usr={usr}
                        key={index + 1}
                        index={index}
                        allUsers={allUsers}
                        setAllUsers={setAllUsers}
                      />
                    );
                  })
                )}
              </tbody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="div-denied d-flex align-items-center justify-content-center">
          <h1 className="text-center display-1">
            ⚠️ 404 NOT FOUND
          </h1>
        </div>
      )}
    </>
  );
}

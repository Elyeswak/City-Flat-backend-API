import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./UsersDash.css";
import axios from "axios";

export default function AllUserssRow({ index, usr, allUsers, setAllUsers }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [name, setName] = useState(usr.name);
  const [number, setNumber] = useState(usr.number);
  const [email, setEmail] = useState(usr.email);
  const [verified, setVerified] = useState(usr.isVerified);
  const userLoc = JSON.parse(localStorage.getItem("user"));
  const userId = userLoc.id;
  const userToken = userLoc.token;
  const handleCheckboxChange = (event) => {
    const isChecked = event.target.checked;
    setVerified(isChecked);
    console.log(verified);
  };
  //   const handleUserUpdate = (e) => {
  //     e.preventDefault();
  //     const updatedUser = {
  //       isVerified: verified,
  //     };
  //     axios
  //       .put(`http://localhost:9090/user/${usr.id}`, updatedUser, {
  //         headers: {
  //           Authorization: `Bearer ${userToken}`,
  //         },
  //       })
  //       .then((res) => {
  //         console.log(updatedUser);
  //         toast.success("✅ User account state modified successfully", {
  //           position: "top-right",
  //           autoClose: 2000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: true,
  //           draggable: true,
  //           progress: undefined,
  //           theme: "light",
  //         });
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         toast.error(
  //           "❌ An error occured while trying to modify User account state!",
  //           {
  //             position: "top-right",
  //             autoClose: 2000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "light",
  //           }
  //         );
  //       });
  //   };

  const handleUserUpdate = (e) => {
    e.preventDefault();
    const updatedUser = {
      isVerified: verified,
    };

    axios
      .put(`http://localhost:9090/user/${usr.id}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
      .then((response) => {
        // Update the apartment data in the state
        const updatedUsers = allUsers.map((a) =>
          a.id === usr.id ? response.data : a
        );
        setAllUsers(updatedUsers);
        // console.log("updatedUser", updatedUser);

        toast.success("✅ Changes saved successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.log(error);
        toast.error("❌ An error occured while trying to save the changes!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const handleDelete = (deleteId) => {
    if (confirmingDelete) {
      axios
        .delete(`http://localhost:9090/user/${deleteId}`, {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        })
        .then((response) => {
          // remove the deleted user from the users array
          const updatedUsers = allUsers.filter((user) => user.id !== deleteId);
          setAllUsers(updatedUsers);

          toast.success("✅ User deleted successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });

          // add the declined order to the deletedUser array
          // const deletedUser = orders.find((order) => order.id === appartId);
          // setdeletedUsers([...deletedUsers, deletedUser]);

          console.log(response.data); // handle response data
        })
        .catch((e) => {
          console.log(e.message); // handle error
          toast.error("❌ An error occured while trying to delete the User!", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .finally(() => {
          setConfirmingDelete(false);
        });
    } else {
      setConfirmingDelete(true);
      setTimeout(() => {
        setConfirmingDelete(false);
      }, 3000);
    }
  };
  return (
    <>
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
      <tr key={index} className="appart-dash-row">
        <td className="appart-dash-row-index">{index + 1}</td>
        <td>{name}</td>
        <td>{email}</td>
        <td>{number}</td>
        <td>
          <div>
            <button
              className="btn btn-danger rounded-pill"
              onClick={() => handleDelete(usr.id)}
            >
              {confirmingDelete ? "Confirm" : "Delete"}
            </button>
          </div>
        </td>
        <td>
          <form
            onSubmit={handleUserUpdate}
            className="d-flex align-items-center"
          >
            <label className="switch">
              <input
                type="checkbox"
                checked={verified}
                onChange={handleCheckboxChange}
              />
              <span className="slider" />
            </label>
            <button className="btn btn-warning text-light ms-2" type="submit">
              Apply
            </button>
          </form>
        </td>
      </tr>
    </>
  );
}

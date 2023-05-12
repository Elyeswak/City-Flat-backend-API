import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./UsersDash.css";
import axios from "axios";
import Toggle from "react-toggle";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";


export default function AllUserssRow({ index, usr, allUsers, setAllUsers }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [name, setName] = useState(usr.name);
  const [number, setNumber] = useState(usr.number);
  const [email, setEmail] = useState(usr.email);
  const [verified, setVerified] = useState(usr.isVerified);
  const userLoc = JSON.parse(localStorage.getItem("user"));
  const userId = userLoc.id;
  const userToken = userLoc.token;

  const handleToggleChange = (event) => {
    const isChecked = event.target.checked;
    setVerified(isChecked);

    const updatedUser = {
      isVerified: isChecked,
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

        toast.success("✅ Änderungen erfolgreich gespeichert.", {
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
        toast.error("❌Ein Fehler ist aufgetreten, während versucht wurde, die Änderungen zu speichern!", {
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
    Swal.fire({
      title: "Sind Sie sicher?",
      text: "Sie können dies nicht rückgängig machen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText:"Abbrechen",
      confirmButtonText: "Ja, löschen Sie es!",
    }).then((result) => {
      if (result.isConfirmed) {
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
  
            toast.success("✅ Benutzer erfolgreich gelöscht.", {
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
  
            console.log(response.data); // handle response data
          })
          .catch((e) => {
            console.log(e.message); // handle error
            toast.error("❌ Ein Fehler ist aufgetreten, während versucht wurde, den Benutzer zu löschen!", {
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
      }
    });
  };


  useEffect(() => {
    setName(usr.name);
    setEmail(usr.email);
    setNumber(usr.number);
    setVerified(usr.isVerified);
  }, [usr]);

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
        <td>{verified ? "Actif" : "Inactif"}</td>
        <td className="d-flex justify-content-center align-items-center">
          <div className="me-2">
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(usr.id)}
            >
              <FontAwesomeIcon icon={faTrash}/>
            </button>
          </div>
          <Toggle checked={verified} onChange={handleToggleChange} />
        </td>
      </tr>
    </>
  );
}

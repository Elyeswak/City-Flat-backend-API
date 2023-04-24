import axios from "axios";
import React, { useState } from "react";

export default function AllAppartmentsRow({
  index,
  appart,
  allAppartments,
  setAllAppartments,
  handleShowDetails,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const handleDelete = (appartId) => {
    if (confirmingDelete) {
      axios
        .delete(`http://localhost:9090/user/appartments/${appartId}`, { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // remove the declined order from the orders array
          const updatedAppartments = allAppartments.filter(
            (appart) => appart.id !== appartId
          );
          setAllAppartments(updatedAppartments);

          // add the declined order to the declinedOrders array
          // const declinedOrder = orders.find((order) => order.id === appartId);
          // setDeclinedOrders([...declinedOrders, declinedOrder]);

          console.log(response.data); // handle response data
        })
        .catch((e) => {
          console.log(e.message); // handle error
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
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{appart.name}</td>
      <td>£ {appart.pricePerNight}</td>
      <td>{appart.location}</td>
      <td>{appart.type}</td>
      <td>{appart.rooms}</td>
      <td>
        <div>
          <button
            className="btn btn-danger rounded-pill"
            onClick={() => handleDelete(appart.id)}
          >
            {confirmingDelete ? "Confirm" : "Delete"}
          </button>
        </div>
      </td>
      <td>
        <button
          className="btn btn-info rounded-pill ml-2"
          onClick={() => handleShowDetails(appart)}
        >
          Details
        </button>
      </td>
    </tr>
  );
}

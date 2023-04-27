import axios from "axios";
import React, { useState } from "react";
import "./ServicesDash.css";

export default function AllServicesRow({
  index,
  allServices,
  setAllServices,
  handleShowDetails,
  srv,
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.token;
  const handleDelete = (srvId) => {
    if (confirmingDelete) {
      axios
        .delete(`http://localhost:9090/user/services/${srvId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          // remove the declined order from the orders array
          const updatedAppartments = allServices.filter(
            (appart) => appart.id !== srvId
          );
          setAllServices(updatedAppartments);

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
    <tr key={index + 1} className="services-dash-row">
      <td className="services-dash-row-index">
        {index + 1} <span>🖋️</span>
      </td>
      <td>{srv.name}</td>
      <td>£ {srv.pricePerNight}</td>
      <td>
        <div>
          <button
            className="btn btn-danger rounded-pill"
            onClick={() => handleDelete(srv.id)}
          >
            {confirmingDelete ? "Confirm" : "Delete"}
          </button>
        </div>
      </td>
      <td>
        <button
          className="btn btn-info rounded-pill ml-2"
          onClick={() => handleShowDetails(srv)}
        >
          Details
        </button>
      </td>
    </tr>
  );
}

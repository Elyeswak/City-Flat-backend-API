import React, { useState } from 'react';
import { Table } from 'react-bootstrap';

const ReservationHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const orders = [
    {
      id: 1,
      date: "2022-03-31",
      total: 200,
      products: [
        { id: 1, name: "Product 1", price: 50, quantity: 2 },
        { id: 2, name: "Product 2", price: 25, quantity: 4 },
      ],
    },
    {
      id: 2,
      date: "2022-03-28",
      total: 150,
      products: [
        { id: 3, name: "Product 3", price: 30, quantity: 2 },
        { id: 4, name: "Product 4", price: 45, quantity: 2 },
      ],
    },
    {
      id: 3,
      date: "2022-03-25",
      total: 100,
      products: [
        { id: 5, name: "Product 5", price: 20, quantity: 2 },
        { id: 6, name: "Product 6", price: 30, quantity: 2 },
      ],
    },
  ];


  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className={selectedOrder === order ? 'table-active' : ''}
              onClick={() => handleRowClick(order)}
            >
              <td>{order.id}</td>
              <td>{order.date}</td>
              <td>{order.total}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedOrder && (
        <div>
          <h4>Order Details:</h4>
          <p>Order ID: {selectedOrder.id}</p>
          <p>Date: {selectedOrder.date}</p>
          <p>Total: {selectedOrder.total}</p>
          <Table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price * product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
};

export default ReservationHistory;

import { useState, useEffect } from 'react';
import api from '../api';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [returningItemId, setReturningItemId] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get('/orders/history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        console.log('Fetched orders:', response.data);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
    fetchOrders();
  }, []);

async function handleReturn(orderId) {
  try {
    const response = await api.put(`/orders/${orderId}/return`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });

    if (response.status === 200) {
      setReturningItemId(orderId);

      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id === orderId) {
            const items = order.items.map((item) => {
              order.status = "returned";
              return { ...item, status: "returned" };
            });
            return { ...order, items };
          } else {
            return order;
          }
        })
      );
    } else {
      console.error('Failed to return item:', response.status);
    }
  } catch (error) {
    console.error('Error returning item:', error);
  }
}

  return (
    <div>
      <h1>Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <div key={order._id}>
            <h2>Order ID: {order._id}</h2>
            <h3>Total Price: ${order.totalPrice.toFixed(2)}</h3>
            <p>Status: {order.status}</p>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.product._id}>
                    <td>{item.product.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {order.status === 'pending' && (
  <button onClick={() => handleReturn(order._id)}>Return order</button>
            )}
          </div>
        ))
      )}
      {returningItemId && <p>Product returned.</p>}
    </div>
  );
}

export default OrdersPage;

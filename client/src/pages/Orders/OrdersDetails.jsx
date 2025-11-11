import { useEffect, useState } from "react";
import axios from "../../api/axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/orders/myorders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading your orders...</div>;
  }

  if (!orders.length) {
    return (
      <div className="text-center mt-10 text-gray-500">
        You haven’t placed any orders yet 🛍️
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow rounded-lg p-5 hover:shadow-lg transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <h3 className="font-semibold text-lg">
                Order ID:{" "}
                <span className="text-gray-600 font-normal">{order._id}</span>
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  order.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.isPaid ? "Paid" : "Pending"}
              </span>
            </div>

            {/* Items */}
            <ul className="divide-y">
              {order.items.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      ₹{item.product.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ₹{(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            {/* Total */}
            <div className="flex justify-between border-t pt-3 mt-3 font-bold">
              <span>Total:</span>
              <span>₹{order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;

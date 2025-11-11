import { useCart } from "../../context/useCart";
import { Link } from "react-router-dom";
import { useState } from "react";
import API from "../../api/axios";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    setCheckoutError(null);
    setOrderSuccess(null);

    const orderData = {
      items: cart.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: total,
    };

    try {
      const res = await API.post("/orders", orderData);

      setOrderSuccess(res.data);
      clearCart();
    } catch (error) {
      console.error("Order Creation Failed:", error);

      setCheckoutError(
        error.response?.message?.data ||
          "An unexpected error occurred during checkout or See if you are logged in."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10 text-gray-500">
        {orderSuccess ? (
          <div className="text-green-600 font-bold text-xl mb-4">
            Order placed successfully! 🎉 Order ID: {orderSuccess._id}
            <Link to={`/orders`} className="block text-blue-500 mt-2">
              View Order
            </Link>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500 text-lg font-medium">
            Your cart is empty 🛍️
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>

      {checkoutError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {checkoutError}</span>
        </div>
      )}

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
          >
            <div>
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-gray-500">₹{item.price}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item._id, Number(e.target.value))
                }
                className="w-16 border rounded p-1 text-center"
              />
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 border-t pt-4">
        <h3 className="font-bold text-xl">Total: ₹{total.toFixed(2)}</h3>
        <button
          onClick={clearCart}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          disabled={isProcessing}
        >
          Clear Cart
        </button>

        <button
          onClick={handleCheckout}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          disabled={isProcessing || cart.length === 0}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Cart;

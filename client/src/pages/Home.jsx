import { React, useEffect, useState } from "react";
import { Link } from "react-router";
import API from "../api/axios";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get(`/products`);
        setProducts(res.data);
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading)
    return (
      <div className="text-center py-10 text-gray-500">Loading products...</div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-10 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Shop the Best Deals Online 🛒
        </h1>
        <p className="text-lg mb-6">
          Discover quality products at unbeatable prices. Fast delivery. Secure
          checkout.
        </p>
      </section>

      {/* Featured Products */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Featured Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {products.slice(0, 3).map((item) => (
            <div
              key={item._id} // ✅ use unique key
              className="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition"
            >
              <img
                src={item.image || "https://via.placeholder.com/300"} // ✅ show image or fallback
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="font-medium text-lg mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-3">₹{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      <Link
        to="/products"
        className="block bg-indigo-600 text-white mt-10 mb-10 py-2 rounded-lg text-center hover:bg-indigo-700 transition"
      >
        View Product
      </Link>

      {/* Promo / Info Section */}
      <section className="bg-indigo-100 py-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Shop With Us?</h2>
        <p className="max-w-2xl mx-auto text-gray-700">
          We offer curated collections, trusted brands, and a seamless shopping
          experience — all from the comfort of your home.
        </p>
      </section>
    </div>
  );
};

export default Home;

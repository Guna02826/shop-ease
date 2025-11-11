import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const EditProduct = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/products/${id}`);
      setForm(res.data);
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/products/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Product updated!");
      navigate("/admin");
    } catch (err) {
      alert("Failed to update product");
      console.error({ message: err.message });
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;

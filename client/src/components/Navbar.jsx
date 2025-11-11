import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900 text-white">
      <Link to="/" className="text-xl font-bold">
        ShopEase
      </Link>
      <div className="space-x-4 flex items-center">
        <Link to="/products">Products</Link>
        <Link to="/cart">
          Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
        </Link>
        {user ? (
          <>
            <span>Hello, {user.name}</span>
            <button onClick={logout} className="bg-red-500 px-2 py-1 rounded">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

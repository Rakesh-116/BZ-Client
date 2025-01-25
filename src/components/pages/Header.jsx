import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("jwt_token");
    if (jwtToken !== undefined) {
      setIsLoggedIn(true);
    }
  }, []);

  const onLogOut = () => {
    Cookies.remove("jwt_token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const onLogIn = () => {
    navigate("/login");
  };

  return (
    <div className="h-16 px-6 py-2 bg-black text-white flex justify-between items-center">
      <span className="">NeoCode</span>
      <div className="flex space-x-4">
        <Link to="/">Home</Link>
        <Link to="/problemset">Problems</Link>
      </div>
      {isLoggedIn ? (
        <button
          type="button"
          className="bg-white text-black px-4 py-2 rounded"
          onClick={() => onLogOut()}
        >
          LogOut
        </button>
      ) : (
        <button
          type="button"
          className="bg-white text-black px-4 py-2 rounded"
          onClick={() => onLogIn()}
        >
          LogIn
        </button>
      )}
    </div>
  );
};

export default Header;

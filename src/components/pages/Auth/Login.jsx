import { useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { LuEyeClosed } from "react-icons/lu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const changeInput = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
  };

  const changeVisibility = () => {
    setIsVisible(!isVisible);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      console.error("All fields are required.");
      return;
    }
    try {
      const apiUrl = "/api/auth/login";
      const response = await axios.post(apiUrl, { username, password });

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        Cookies.set("jwt_token", response.data.token);
        console.log("Cookies luffy: ", Cookies.get("jwt_token"));
        navigate("/");
      }
    } catch (error) {
      console.error("Error making request:", error);
    }
  };

  return (
    <div className="h-screen bg-gray-900 bg-opacity-100 flex flex-col justify-center items-center">
      <form
        onSubmit={submitForm}
        className="bg-blue-200 w-[40%] h-[70%] rounded-md flex flex-col justify-center items-center"
      >
        <h1 className="text-3xl text-center text-gray-900">Login</h1>
        <div className="w-[50%] my-4 rounded-md bg-white">
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full rounded-md px-[10px] py-[6px] outline-none border-none text-[18px]"
            value={username}
            onChange={changeInput}
          />
        </div>
        <div className="w-[50%] my-4 rounded-md bg-white flex justify-between items-center pr-[10px]">
          <input
            type={`${isVisible ? "text" : "password"}`}
            name="password"
            placeholder="Password"
            className="w-[85%] rounded-md px-[10px] py-[6px] outline-none border-none text-[18px]"
            value={password}
            onChange={changeInput}
          />
          <button
            type="button"
            onClick={changeVisibility}
            className="text-gray-700"
          >
            {isVisible ? <IoEyeSharp /> : <LuEyeClosed />}
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-600 px-[10px] py-[6px] text-white rounded-md"
        >
          Submit
        </button>
        <span>
          Don't have an account?
          <button type="button" onClick={() => navigate("/register")}>
            Sign Up
          </button>
        </span>
      </form>
    </div>
  );
};

export default Login;

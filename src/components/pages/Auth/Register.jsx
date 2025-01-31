import { useState } from "react";
import { LuEyeClosed } from "react-icons/lu";
import { IoEyeSharp } from "react-icons/io5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  const changeInput = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "password") setPassword(value);
    if (name === "email") setEmail(value);
  };

  const changeVisibility = () => {
    setIsVisible(!isVisible);
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!username || !password || !email) {
      console.error("All fields are required.");
      return;
    }
    try {
      const apiUrl = "/api/auth/register";
      const response = await axios.post(apiUrl, { username, password, email });

      if (response.status === 201) {
        console.log("Registration successful:", response.data);
        console.log(response);
        console.log(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        Cookies.set("jwt_token", response.data.token);
        // console.log("Cookies luffy: ", Cookies.get("jwt_token"));
        navigate("/"); // Navigate to the home page
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
        <h1 className="text-3xl text-center text-gray-900">Register</h1>
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
        <div className="w-[50%] my-4 rounded-md bg-white">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full rounded-md px-[10px] py-[6px] outline-none border-none text-[18px]"
            value={email}
            onChange={changeInput}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 px-[10px] py-[6px] text-white rounded-md"
        >
          Submit
        </button>
        <span>
          Have an account?
          <button type="button" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </span>
      </form>
    </div>
  );
};

export default Register;

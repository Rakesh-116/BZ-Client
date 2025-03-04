import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";

import Header from "../Header";
import ProblemCard from "./ProblemCard.jsx";

const apiStatusConstant = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstant.initial);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      setApiStatus(apiStatusConstant.inProgress);
      const token = Cookies.get("neo_code_jwt_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("/api/problem/get-all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(response.data.problems);
        setProblems(response.data.problems);
        setApiStatus(apiStatusConstant.success);
      } catch (error) {
        console.error("Error fetching problems:", error);
        if (error.response?.status === 405) {
          handleUnauthorizedError();
        } else {
          setApiStatus(apiStatusConstant.failure);
        }
      }
    };

    fetchProblems();
  }, []);

  const handleUnauthorizedError = () => {
    Cookies.remove("neo_code_jwt_token");
    navigate("/login");
  };

  const onProblemSelect = (probId) => {
    navigate(`/problems/${probId}`);
  };

  const renderLoader = () => (
    <div className="flex justify-center items-center h-screen">
      <Oval
        height={50}
        width={50}
        color="#4fa94d"
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
    </div>
  );

  const renderProblemsFailure = () => (
    <div className="text-center text-white mt-10">
      <h2 className="text-2xl font-semibold">Failed to fetch problem</h2>
      <p className="text-lg">Please try again later.</p>
    </div>
  );

  const renderProblemsSuccess = () => (
    <div className="p-[4%]">
      <h1 className="text-white text-2xl font-mono">Problems</h1>
      <ul>
        {problems.map((pro, index) => (
          <li key={index}>
            <ProblemCard
              problemDetails={pro}
              onProblemSelect={onProblemSelect}
            />
          </li>
        ))}
      </ul>
    </div>
  );

  const renderProblemsComponent = () => {
    switch (apiStatus) {
      case apiStatusConstant.success:
        return renderProblemsSuccess();
      case apiStatusConstant.failure:
        return renderProblemsFailure();
      case apiStatusConstant.inProgress:
        return renderLoader();
      default:
        return null;
    }
  };

  return (
    <div>
      <Header />
      <div className="bg-black/95 min-h-screen pt-20">
        {renderProblemsComponent()}
      </div>
    </div>
  );
};

export default Problems;

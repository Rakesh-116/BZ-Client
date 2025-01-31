import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import Cookies from "js-cookie";

import Header from "../Header";
import ProblemCard from "./ProblemCard.jsx";

const Problems = () => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      const token = Cookies.get("jwt_token");
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
      } catch (error) {
        console.error("Error fetching problems:", error);
        if (error.response.status === 405) {
          navigate("/login");
        }
      }
    };

    fetchProblems();
  }, [navigate]);

  const onProblemSelect = (probId) => {
    navigate(`/problems/${probId}`);
  };

  return (
    <div>
      <Header />
      <div className="p-[4%]">
        <h1 className="font-medium text-[30px]">Problems</h1>
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
    </div>
  );
};

export default Problems;

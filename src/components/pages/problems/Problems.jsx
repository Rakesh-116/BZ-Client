import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

import { problems } from "../../Common/constants.js";
import Header from "../Header";
import ProblemCard from "./ProblemCard.jsx";

const Problems = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwt_token");
    if (token === undefined) {
      navigate("/login");
    }
  });

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

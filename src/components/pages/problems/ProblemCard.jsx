import React from "react";

const ProblemCard = ({ problemDetails, onProblemSelect }) => {
  // console.log(problemDetails);
  const { id, title, score, difficulty } = problemDetails;
  return (
    <button
      className="w-full flex items-center rounded-md my-3 px-3 py-2 bg-slate-300 hover:bg-slate-400"
      onClick={() => onProblemSelect(id)}
    >
      <div className="w-2/3 text-start">
        <h1>{title}</h1>
      </div>
      <div className="w-1/3 flex justify-end items-center gap-3">
        <p className="text-sm ">Score: {score}</p>
        <p className="text-sm">
          Difficulty:{" "}
          <span className="p-[1px] px-[4px] bg-blue-400 text-white font-medium text-xs rounded-md">
            {difficulty.toUpperCase()}
          </span>
        </p>
      </div>
    </button>
  );
};

export default ProblemCard;

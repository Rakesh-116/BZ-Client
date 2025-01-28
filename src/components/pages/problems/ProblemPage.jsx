import { useParams } from "react-router-dom";
import { useState } from "react";

import CodeEditor from "./CodeEditor";
import { problems } from "../../Common/constants";
import Header from "../Header";

const ProblemPage = () => {
  const { id } = useParams();
  // console.log(
  //   "id: ",
  //   id,
  //   ";",
  //   problems,
  //   ";",
  //   problems.find((pro) => (pro.problemId === id)?.pro || [])
  // );
  const [problem, setProblem] = useState(problems[0]);
  const [explanation, setExplanation] = useState(true);

  const {
    title,
    description,
    difficulty,
    prohibitedKeys,
    inputFormat,
    outputFormat,
    constraints,
    sampleInput,
    sampleOutput,
  } = problem;

  // console.log(sampleInput[0]["si1"]);

  const Section = ({ title, content }) => {
    // console.log(content);
    return (
      <>
        <hr className="border-slate-500 w-full my-4" />
        <h3 className="text-white text-lg font-semibold">{title}</h3>
        <p className="text-white">{content}</p>
      </>
    );
  };

  return (
    <>
      <Header />
      <div className="w-full p-[2%] bg-slate-900 min-h-screen">
        <div className="w-full sticky top-0 mb-3 -mt-1">
          <div className="bg-slate-700 flex justify-evenly rounded-md p-[4px] w-[200px]">
            <button className="bg-blue-500 text-white rounded-lg p-2">
              Description
            </button>
            <button className="text-white">Submission</button>
          </div>
        </div>
        <div className="flex justify-evenly">
          <div className="w-1/2 h-screen overflow-y-scroll scroll-smooth">
            <h3 className="my-2 text-2xl text-white font-bold">{title}</h3>
            <span className="p-[1px] px-[4px] bg-blue-400 text-white font-medium text-xs rounded-md">
              {difficulty}
            </span>

            <Section title="Description" content={description} />

            <hr className="border-slate-500 w-full my-4" />
            <h3 className="text-white text-lg font-semibold">
              Prohibited Keys
            </h3>
            <ul className="text-white">
              {prohibitedKeys.map((keyObj, index) => (
                <li key={index}>
                  {Object.entries(keyObj)
                    .map(([language, key]) => `${language}: ${key}`)
                    .join(", ")}
                </li>
              ))}
            </ul>

            <Section title="Input Format" content={inputFormat} />
            <Section title="Output Format" content={outputFormat} />
            <Section title="Constraints" content={constraints} />

            <hr className="border-slate-500 w-full my-4" />
            <h3 className="text-white font-medium text-lg">Example</h3>
            <div className="w-full flex items-start text-white mt-4">
              <div className="w-1/2 mr-2">
                <p>Input</p>
                <div className="bg-slate-600 py-2 px-3 rounded-md my-2">
                  <p>{sampleInput[0]["tc1"]}</p>
                  <p>{sampleInput[1]["tc2"]}</p>
                </div>
              </div>
              <div className="w-1/2 mr-2">
                <p>Output</p>
                <div className="bg-slate-600 py-2 px-3 rounded-md my-2">
                  <p>{sampleOutput[0]["tc1"]}</p>
                  <p>{sampleOutput[1]["tc2"]}</p>
                </div>
              </div>
              {explanation && (
                <div className="w-full mr-2">
                  <p>Explanation</p>
                  <div className="bg-slate-600 py-2 px-3 rounded-md my-2">
                    Self Explainary
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-1/2">
            <h1 className="text-white">
              <CodeEditor sampleIO={[sampleInput, sampleOutput]} />
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProblemPage;

import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { Oval } from "react-loader-spinner";

import CodeEditor from "./CodeEditor";
import Header from "../Header";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblem = async () => {
      setApiStatus(apiStatusConstants.inProgress);
      const token = Cookies.get("jwt_token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`/api/problem/get/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.problem;
        // console.log(data);
        const updatedData = {
          id: data.id,
          title: data.title,
          description: data.description,
          difficulty: data.difficulty,
          inputFormat: data.input_format,
          outputFormat: data.output_format,
          constraints: data.constraints,
          prohibitedKeys: data.prohibited_keys,
          sampleTestcases: data.sample_testcase,
          explaination: data.explaination,
        };

        setProblem(updatedData);
        setApiStatus(apiStatusConstants.success);
      } catch (error) {
        console.error("Error: ", error);
        setApiStatus(apiStatusConstants.failure);
        if (error.response.status === 405) {
          navigate("/login");
        }
      }
    };

    fetchProblem();
  }, [id, navigate]);

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

  const renderFailure = () => (
    <div className="text-center text-white mt-10">
      <h2 className="text-2xl font-semibold">Failed to fetch problem</h2>
      <p className="text-lg">Please try again later.</p>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex justify-evenly">
      <div className="w-1/2 h-screen overflow-y-scroll scroll-smooth">
        <h3 className="my-2 text-2xl text-white font-bold">{problem.title}</h3>
        <span className="p-[1px] px-[4px] bg-blue-400 text-white font-medium text-xs rounded-md">
          {problem.difficulty.toUpperCase()}
        </span>
        <Section title="Description" content={problem.description} />
        <Section
          title="Prohibited Keywords"
          content={
            !problem.prohibitedKeys
              ? "No prohibited keys for this problem."
              : ""
          }
        />
        {problem.prohibitedKeys && (
          <div className="text-white">
            {Object.entries(problem.prohibitedKeys).map(([lang, key]) => (
              <p key={lang}>
                {lang} : {key}
              </p>
            ))}
          </div>
        )}
        {/* {console.log(problem.prohibitedKeys)} */}
        <Section title="Input Format" content={problem.inputFormat} />
        <Section title="Output Format" content={problem.outputFormat} />
        <Section title="Constraints" content={problem.constraints} />
        {/* {console.log(problem.sampleTestcases)} */}
        <hr className="border-slate-500 w-full my-4" />
        <h3 className="text-white text-lg font-semibold">Example</h3>
        <div className="w-full flex items-start text-white mt-4">
          <div className="w-1/2 mr-2">
            <p>Input</p>
            <div className="bg-slate-600 py-2 px-3 rounded-md my-2">
              {problem.sampleTestcases.input.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
          <div className="w-1/2 mr-2">
            <p>Output</p>
            <div className="bg-slate-600 py-2 px-3 rounded-md my-2">
              {problem.sampleTestcases.output.split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
          <div className="w-full mr-2">
            <p>Explaination</p>
            <div className="bg-slate-600 py-2 px-3 rounded-md my-2">
              {problem.explaination}
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2">
        <h1 className="text-white">
          <CodeEditor sampleIO={problem.sampleTestcases} />
        </h1>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="w-full p-[2%] bg-slate-900 min-h-screen">
        {apiStatus === apiStatusConstants.inProgress && renderLoader()}
        {apiStatus === apiStatusConstants.failure && renderFailure()}
        {apiStatus === apiStatusConstants.success && renderSuccess()}
      </div>
    </>
  );
};

const Section = ({ title, content }) => (
  <>
    <hr className="border-slate-500 w-full my-4" />
    <h3 className="text-white text-lg font-semibold">{title}</h3>
    <p className="text-white">{content}</p>
  </>
);

export default ProblemPage;

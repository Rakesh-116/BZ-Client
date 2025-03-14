import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { RxCross2 } from "react-icons/rx";
import { CiPlay1 } from "react-icons/ci";
import { RiResetLeftLine } from "react-icons/ri";

import { languages, themes, defaultCode } from "../../Common/constants";
import SubmissionModal from "../Submissions/SubmissionViewPage.jsx";
import Button from "../../Common/Button";

const CodeEditor = ({
  problemId,
  sampleIO,
  prohibitedKeys,
  solution,
  openEditorData,
}) => {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [language, setLanguage] = useState(languages[1]);
  const [theme, setTheme] = useState("vs-dark");
  const [codeValues, setCodeValues] = useState({ ...defaultCode });
  const [customInput, setCustomInput] = useState("");
  const [inputDisplay, setInputDisplay] = useState("si1");
  const [isHovered, setIsHovered] = useState(null);
  const [outputValue, setOutputValue] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openProhibitedKeyModal, setOpenProhibitedKeyModal] = useState(false);

  useEffect(() => {
    console.log(openEditorData);
    if (openEditorData && openEditorData.code && openEditorData.language) {
      const { code, language } = openEditorData;
      setCodeValues((prev) => ({
        ...prev,
        [language]: code,
      }));
      setLanguage(language);
      console.log(code, language);
    } else {
      setCodeValues(codeValues);
    }
  }, [openEditorData]);

  // useEffect(() => {
  //   setCodeValues(codeValues);
  //   console.log("cdscs: ", codeValues[language]);
  // }, [language]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const selectedInputValue =
    inputDisplay === "custom" ? customInput : sampleIO.input || "";

  const handleCustomInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setCodeValues((prev) => ({
      ...prev,
      [language]: editorRef.current.getValue(),
    }));
    setLanguage(e.target.value);
  };

  const checkForProhibitedKeys = (sourceCode) => {
    const pkey = prohibitedKeys[language];
    const pkeyArray = pkey.split(",");

    for (let i = 0; i < pkeyArray.length; i++) {
      if (sourceCode.includes(pkeyArray[i])) return true;
    }
    return false;
  };

  const renderProhibitedKeyModal = () => {
    return (
      <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-60 z-50">
        <div className="bg-gray-800 mt-32 text-white p-6 rounded-lg shadow-lg w-2/3 text-center">
          <div className="flex justify-between">
            <h1 className="text-xl font-semibold">Prohibited Key Detected</h1>
            <Button
              className="text-white"
              onClick={() => {
                setOpenProhibitedKeyModal(false);
              }}
            >
              <RxCross2 />
            </Button>
          </div>
          <h1 className="text-start mt-6">
            Do not use any prohibited keys mentioned, you are using{" "}
            <span className="text-red-600">'{prohibitedKeys[language]}'</span>{" "}
            in your code
          </h1>
        </div>
      </div>
    );
  };

  const runCode = async () => {
    console.log(solution);
    const sourceCode = editorRef.current.getValue();
    if (prohibitedKeys !== null) {
      if (checkForProhibitedKeys(sourceCode)) {
        setOpenProhibitedKeyModal(true);
        return;
      }
    }
    // console.log(sourceCode, language, selectedInputValue);
    const token = Cookies.get("neo_code_jwt_token");
    console.log("JWT Token:", token);
    try {
      setIsCodeRunning(true);
      const response = await axios.post(
        "/api/problem/execute",
        {
          sourceCode,
          language,
          input: selectedInputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      console.log(response.data.output);
      setOutputValue(response.data.output);
      setIsCodeRunning(false);
    } catch (error) {
      console.error("Error: ", error.response.data.message.error);
      setOutputValue(error.response.data.message.error);
      setIsCodeRunning(false);
      // JWT token is present in cookies but it is expired, so instead of refreshing the token, we are asking the user to login again, so the new token will re-initialized to exporation time
      // All the expiration error will have status code of 405
      if (error.response.status === 405) {
        navigate("/login");
      }
    }
  };

  const submitCode = async () => {
    setSubmissionResult(null);
    const sourceCode = editorRef.current.getValue();
    if (prohibitedKeys !== null) {
      if (checkForProhibitedKeys(sourceCode)) {
        setOpenProhibitedKeyModal(true);
        return;
      }
    }
    // console.log(sourceCode, language, selectedInputValue);
    const token = Cookies.get("neo_code_jwt_token");
    console.log("JWT Token:", token);
    console.log("si:", selectedInputValue);
    try {
      setOpenModal(true);
      const response = await axios.post(
        "/api/problem/submit",
        {
          problemId,
          sourceCode,
          language,
          input: selectedInputValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const finalResult = response.data.insertHiddenTestcasesResult.rows[0];
      console.log("luffy final:", finalResult);
      setSubmissionResult(finalResult);
    } catch (error) {
      console.error("Error: ", error.response.data.message);
      setOutputValue(error.response.data.message.message);
      setIsCodeRunning(false);
      // JWT token is present in cookies but it is expired, so instead of refreshing the token, we are asking the user to login again, so the new token will re-initialized to exporation time
      // All the expiration error will have status code of 405
      if (error.response.status === 405) {
        navigate("/login");
      }
    }
  };

  const getExpectedOutput = async () => {
    const token = Cookies.get("neo_code_jwt_token");
    try {
      setIsCodeRunning(true);
      const response = await axios.post(
        "/api/problem/get-expected-output",
        {
          problemId,
          input: selectedInputValue,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOutputValue(response.data.output);
      console.log(response);
      setIsCodeRunning(false);
    } catch (error) {
      setOutputValue(error.response.data.message.message);
      setIsCodeRunning(false);
      if (error.response.status === 405) {
        navigate("/login");
      }
    }
  };

  // const renderOpenModal = () => {
  //   console.log(submissionResult);
  //   const sourceCode = editorRef.current.getValue();
  //   return (
  //     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
  //       <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-2/3 text-center">
  //         <div className="flex justify-between items-center mb-6">
  //           <h2 className="text-xl font-semibold">Submission</h2>
  //           <Button
  //             className="text-white"
  //             onClick={() => {
  //               setOpenModal(false);
  //               setOutputValue(null);
  //             }}
  //           >
  //             <RxCross2 />
  //           </Button>
  //         </div>
  //         <div className="overflow-x-auto">
  //           <table className="w-full border-collapse border border-gray-600">
  //             <thead>
  //               <tr className="bg-gray-700">
  //                 <th className="border border-gray-600 px-4 py-2">Verdict</th>
  //                 <th className="border border-gray-600 px-4 py-2">Language</th>
  //                 <th className="border border-gray-600 px-4 py-2">Time</th>
  //                 <th className="border border-gray-600 px-4 py-2">
  //                   Submission Id
  //                 </th>
  //                 <th className="border border-gray-600 px-4 py-2">
  //                   Subtask Info
  //                 </th>
  //               </tr>
  //             </thead>
  //             <tbody>
  //               <tr className="bg-gray-800">
  //                 <td className="border border-gray-600 px-4 py-2 text-[12px]">
  //                   {submissionResult ? (
  //                     <h1
  //                       className={`font-bold ${
  //                         submissionResult.verdict === "ACCEPTED"
  //                           ? "text-green-500"
  //                           : "text-red-500"
  //                       }`}
  //                     >
  //                       {submissionResult.verdict}
  //                     </h1>
  //                   ) : (
  //                     <div className="flex justify-center">
  //                       {renderLoader(30, 30)}
  //                     </div>
  //                   )}
  //                 </td>
  //                 <td className="border border-gray-600 px-4 py-2 text-[12px]">
  //                   {language.toUpperCase()}
  //                 </td>
  //                 <td className="border border-gray-600 px-4 py-2 text-[12px]">
  //                   {new Date().toLocaleString()}
  //                 </td>
  //                 <td className="border border-gray-600 px-4 py-2 text-[12px]">
  //                   {submissionResult ? (
  //                     submissionResult.id
  //                   ) : (
  //                     <div className="flex justify-center">
  //                       {renderLoader(30, 30)}
  //                     </div>
  //                   )}
  //                 </td>
  //                 <td className="border border-gray-600 px-4 py-2 text-[12px]">
  //                   {submissionResult ? (
  //                     submissionResult.subtaskInfo
  //                   ) : (
  //                     <div className="flex justify-center">
  //                       {renderLoader(30, 30)}
  //                     </div>
  //                   )}
  //                 </td>
  //               </tr>
  //             </tbody>
  //           </table>
  //           <div className="my-4">
  //             <Editor
  //               height="60vh"
  //               width="100%"
  //               language={language}
  //               theme={theme}
  //               value={sourceCode}
  //               options={{
  //                 fontSize: 16,
  //                 minimap: { enabled: false },
  //                 readOnly: true,
  //                 padding: { top: 10, bottom: 10 },
  //                 scrollBeyondLastLine: false,
  //               }}
  //             />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };

  const renderLoader = (height = 50, width = 50) => (
    <Oval
      height={height}
      width={width}
      color="#4fa94d"
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
  );

  return (
    <div className="flex flex-col h-full w-full rounded-md px-4">
      <div className="flex justify-center items-center w-full h-full">
        {openProhibitedKeyModal && renderProhibitedKeyModal()}
        {openModal && (
          <SubmissionModal
            submissionResult={submissionResult}
            editorRef={editorRef}
            language={language}
            theme={theme}
            setOpenModal={setOpenModal}
            setOutputValue={setOutputValue}
          />
        )}
      </div>
      <div className="w-full flex flex-col">
        <div className="px-4 bg-black border-b border-white/20 rounded-t-xl h-16 flex gap-4 items-center">
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="rounded p-[6px] bg-white/10 text-white"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang} className="text-black">
                {lang.toUpperCase()}
              </option>
            ))}
          </select>

          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded p-[6px] bg-white/10 text-white"
          >
            {themes.map((theme) => (
              <option key={theme} value={theme} className="text-black">
                {theme.toUpperCase()}
              </option>
            ))}
          </select>
          <button
            onMouseEnter={() => setIsHovered("reset")}
            onMouseLeave={() => setIsHovered(null)}
            className="outline-none"
          >
            <RiResetLeftLine />
            <p
              className={`bg-black text-white px-2 py-1 rounded-md absolute z-20 text-xs  ${
                isHovered === "reset" ? "" : "hidden"
              }`}
            >
              Reset Code
            </p>
          </button>
        </div>

        <div className="rounded-lg scroll-smooth">
          <Editor
            height="60vh"
            width="100%"
            language={language}
            theme={theme}
            value={codeValues[language]}
            onChange={(value) =>
              setCodeValues((prev) => ({ ...prev, [language]: value }))
            }
            onMount={onMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              padding: { top: 10, bottom: 10 },
              scrollBeyondLastLine: false,
            }}
          />
        </div>
        <div className="px-4 py-2 bg-black border-t border-white/20 rounded-b-xl h-14 mb-2">
          <div className="flex justify-between items-center">
            <select
              id="inputType"
              className="rounded p-[6px] bg-white/10 text-white"
              value={inputDisplay}
              onChange={(e) => setInputDisplay(e.target.value)}
            >
              <option value="custom" className="text-black">
                CUSTOM INPUT
              </option>
              <option value="si1" className="text-black">
                SAMPLE INPUT 1
              </option>
            </select>
            {solution && (
              <button
                className={`p-2 rounded-lg border border-white/50 flex justify-center items-center outline-none hover:border-white text-white transition-all duration-300 ${
                  inputDisplay === "custom" ? "block" : "hidden"
                }`}
                onClick={() => getExpectedOutput()}
              >
                <CiPlay1 className="transition-all duration-300 text-green-400" />
                <p className="px-2 py-[2px] text-xs ">Expected Output</p>
              </button>
            )}
            <div className="flex gap-4">
              <Button
                className={`${
                  isCodeRunning
                    ? "bg-slate-500 text-slate-800"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white px-[12px] py-[6px]`}
                onClick={() => runCode()}
                disabled={isCodeRunning}
              >
                Run
              </Button>
              <Button
                className={`${
                  isCodeRunning
                    ? "bg-slate-500 text-slate-800"
                    : "bg-green-500 hover:bg-green-600"
                } text-white px-[12px] py-[6px]`}
                disabled={isCodeRunning}
                onClick={() => submitCode()}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        {/* Loader */}

        {isCodeRunning && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
            {" "}
            {renderLoader()}
          </div>
        )}

        <div className={``}>
          <textarea
            value={selectedInputValue}
            onChange={
              inputDisplay === "custom" ? handleCustomInputChange : undefined
            }
            className="bg-slate-500 my-2 rounded-lg p-2 h-[100px] w-full"
            disabled={inputDisplay !== "custom"}
          />

          <p className="text-[20px] font-semibold mt-2">Output</p>

          <textarea
            value={outputValue ?? ""}
            readOnly
            className={`my-2 rounded-lg p-2 w-full h-20 outline-none ${
              outputValue === null
                ? "bg-slate-500"
                : outputValue === sampleIO.output
                ? "bg-green-400"
                : "bg-red-400"
            }`}
          />

          {/* <div className="bg-slate-600 py-2 px-3 rounded-md my-2">
            <pre
              className={`${
                outputValue === sampleIO.output.trimEnd()
                  ? "bg-green-400"
                  : "bg-red-400"
              }`}
            >
              {console.log(sampleIO.output)}
              {console.log(outputValue.trimEnd())}
              {console.log(sampleIO.output === outputValue.trimEnd())}
            </pre>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

// import java.util.*;

// class NeoCode {
//     public static void main(String[] args){
//         Scanner sc = new Scanner(System.in);
//         int t = sc.nextInt();
//         while(t-->0){
//             int a = sc.nextInt();
//             int b = sc.nextInt();
//             System.out.println(Math.abs(-a-b));
//         }
//     }
// }

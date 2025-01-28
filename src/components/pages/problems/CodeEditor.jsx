import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";

import { languages, themes, defaultCode } from "../../Common/constants";
import Button from "../../Common/Button";
import { RiResetLeftLine } from "react-icons/ri";

const CodeEditor = ({ sampleIO }) => {
  const editorRef = useRef(null);
  const navigate = useNavigate();

  const [language, setLanguage] = useState(languages[1]);
  const [theme, setTheme] = useState("vs-dark");
  const [codeValue, setCodeValue] = useState(defaultCode[language]);
  const [customInput, setCustomInput] = useState("");
  const [inputDisplay, setInputDisplay] = useState(
    sampleIO[0].map((si) => Object.keys(si)).flat()[0]
  );
  const [isHovered, setIsHovered] = useState(null);
  const [outputValue, setOutputValue] = useState(null);
  const [isCodeRunning, setIsCodeRunning] = useState(false);

  useEffect(() => {
    setCodeValue(defaultCode[language]);
  }, [language]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const selectedInputValue =
    inputDisplay === "custom"
      ? customInput
      : sampleIO[0].find((si) => Object.keys(si)[0] === inputDisplay)?.[
          inputDisplay
        ] || "";

  const selectedOutputValue =
    sampleIO[1].find((si) =>
      Object.entries(si).some(([key, value]) => key === inputDisplay && value)
    )?.[inputDisplay] || "";

  const handleCustomInputChange = (e) => {
    setCustomInput(e.target.value);
  };

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    console.log(sourceCode, language, selectedInputValue);
    const token = Cookies.get("jwt_token");
    // console.log("JWT Token:", token);
    try {
      setIsCodeRunning(true);
      const response = await axios.post(
        "http://localhost:8080/api/problem/execute",
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
      console.log(response.data.message);
      setOutputValue(response.data.message);
      setIsCodeRunning(false);
    } catch (error) {
      console.error("Error: ", error.response.data.message);
      setOutputValue(error.response.data.message);
      setIsCodeRunning(false);
      // JWT token is present in cookies but it is expired, so instead of refreshing the token, we are asking the user to login again, so the new token will re-initialized to exporation time
      // All the expiration error will have status code of 405
      if (error.response.status === 405) {
        navigate("/login");
      }
    }
  };

  const renderLoader = () => (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 z-10">
      <Oval
        height={50}
        width={50}
        color="#4fa94d"
        // visible={true}
        // ariaLabel="oval-loading"
        // secondaryColor="#4fa94d"
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full bg-slate-900 rounded-md p-4">
      <div className="w-full flex flex-col">
        <div className="flex gap-4 items-center mb-4">
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded p-[6px] bg-gray-700 text-white"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>

          <select
            id="theme"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="rounded p-[6px] bg-gray-700 text-white"
          >
            {themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
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
              className={`bg-black text-white px-2 py-1 rounded-md absolute z-20  ${
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
            value={codeValue}
            onChange={(value) => setCodeValue(value)}
            onMount={onMount}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>
      <div className="mt-4 flex justify-between gap-3">
        <select
          id="inputType"
          className="rounded p-2 bg-gray-700 text-white"
          value={inputDisplay}
          onChange={(e) => setInputDisplay(e.target.value)}
        >
          <option value="custom">Custom Input</option>
          {sampleIO[0].map((si, index) => (
            <option key={index} value={Object.keys(si)[0]}>
              {Object.keys(si)[0]}
            </option>
          ))}
        </select>
        <div className="flex gap-4">
          <Button
            className={`${
              isCodeRunning
                ? "bg-slate-500 text-slate-800"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
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
            } text-white`}
            disabled={isCodeRunning}
          >
            Submit
          </Button>
        </div>
      </div>
      <div className="relative">
        {/* Loader */}
        {isCodeRunning && renderLoader()}

        <div className={``}>
          <textarea
            value={selectedInputValue}
            onChange={
              inputDisplay === "custom" ? handleCustomInputChange : undefined
            }
            className="bg-slate-500 my-2 rounded-lg p-2 w-full"
            disabled={inputDisplay !== "custom"}
          />

          <p className="text-[20px] font-semibold my-2">Output</p>

          <textarea
            value={outputValue ?? ""}
            readOnly
            className={`my-2 rounded-lg p-2 w-full ${
              outputValue !== null &&
              outputValue.trim() === selectedOutputValue.trim()
                ? "bg-green-400"
                : outputValue !== null &&
                  outputValue.trim() !== selectedOutputValue.trim()
                ? "bg-red-400"
                : "bg-slate-500"
            }`}
          />
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
//         int a = sc.nextInt();
//         int b = sc.nextInt();
//         System.out.println(Math.abs(-a-b));
//     }
// }

import React from "react";
import { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

import { languages, themes, defaultCode } from "../../Common/constants";
import Button from "../../Common/Button";

const CodeEditor = ({ sampleIO }) => {
  const editorRef = useRef(null);

  const [language, setLanguage] = useState(languages[2]);
  const [theme, setTheme] = useState("vs-dark");
  const [codeValue, setCodeValue] = useState(defaultCode[language]);

  // console.log(defaultCode, defaultCode[language]);

  useEffect(() => {
    setCodeValue(defaultCode[language]);
  }, [language]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  // console.log("sample", sampleIO);

  const sampleInput = sampleIO[0].map((si) => Object.keys(si)).flat();

  const [inputDisplay, setInputDisplay] = useState(sampleInput[0]);

  // console.log(sampleIO[0], inputDisplay, sampleIO[0][inputDisplay]);
  // console.log("sampleIO[0]:", sampleIO[0]);
  // console.log("inputDisplay:", inputDisplay);
  // console.log(
  //   "Value:",
  //   sampleIO[0].map((si) => Object.keys(si)[0])
  // );

  const selectedInputValue =
    sampleIO[0].find((si) => Object.keys(si)[0] === inputDisplay)?.[
      inputDisplay
    ] || "";

  const selectedOutputValue =
    sampleIO[1].find((si) =>
      Object.entries(si).some(([key, value]) => key === inputDisplay && value)
    )?.[inputDisplay] || "";

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
        </div>

        <Editor
          height="60vh"
          width="100%"
          language={language}
          theme={theme}
          defaultValue="// your code goes here"
          value={codeValue}
          onChange={(value) => setCodeValue(value)}
          onMount={onMount}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
          }}
        />
      </div>
      <div className="mt-4 flex justify-between gap-3">
        <select
          id="inputType"
          className="rounded p-2 bg-gray-700 text-white"
          value={inputDisplay}
          onChange={(e) => setInputDisplay(e.target.value)}
        >
          <option value="custom">Custom Input</option>
          {sampleInput.map((si, index) => (
            <option key={index} value={si}>
              {si}
            </option>
          ))}
        </select>
        <div className="flex gap-4">
          <Button>Run</Button>
          <Button className="bg-green-500 hover:bg-green-600">Submit</Button>
        </div>
      </div>
      <textarea
        value={selectedInputValue}
        onChange={(e) => setInputDisplay(e.target.value)}
        className="bg-slate-500 my-2 rounded-lg p-2"
        disabled={inputDisplay !== "custom"}
      />
      <p className="text-[20px] font-semibold my-2">Output</p>
      <textarea
        value={selectedOutputValue}
        readOnly
        className="bg-slate-500 my-2 rounded-lg p-2"
      />
    </div>
  );
};

export default CodeEditor;

const problems = [
  {
    problemId: 1,
    title: "A+B Input-Output Practice - (I)",
    difficulty: "CAKEWALK",
    description:
      "Your task is to Calculate A + B. You are not allowed to use PLUS (+) Symbol to add two given numbers",
    prohibitedKeys: [
      { CPP: "+" },
      { Python: "+" },
      { Java: "+" },
      { Javascript: "+" },
    ],
    inputFormat:
      "Single line of input, containing a pair of integers A and B, separated by a space.",
    outputFormat: "Print A+B as answer",
    constraints: "-1000 <= A, B <= 1000",
    sampleInput: [{ tc1: "1 2\n" }, { tc2: "3 4" }],
    sampleOutput: [{ tc1: "3\n" }, { tc2: "7" }],
    score: "10",
  },
  {
    problemId: 2,
    title: "A-B Input-Output Practice - (I)",
    difficulty: "CAKEWALK",
    description: "Your task is to Calculate A - B.",
    prohibitedKeys: [],
    inputFormat:
      "Single line of input, containing a pair of integers A and B, separated by a space.",
    outputFormat: "Print A-B as answer",
    constraints: "-1000 <= A, B <= 1000",
    sampleInput: [{ tc1: "1 2\n" }, { tc2: "4 3" }],
    sampleOutput: [{ tc1: "-1\n" }, { tc2: "1" }],
    score: "10",
  },
];

const languages = ["cpp", "java", "python", "javascript"];

const defaultCode = {
  cpp: "// Your code goes here",
  java: "// Your code goes here",
  python: "# Your code goes here",
  javascript: "// Your code goes here",
};

const themes = [
  "light",
  "vs-dark",
  "hc-black",
  // "all-hallows-eve",
  // "amy",
  // "birds-of-paradise",
  // "blackboard",
];

export { problems, languages, defaultCode, themes };

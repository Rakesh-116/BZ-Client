import Cookies from "js-cookie";
import axios from "axios";

const CreateProblem = () => {
  const createProblem = async () => {
    const token = Cookies.get("jwt_token");
    console.log("JWT Token:", token);
    try {
      const response = await axios.post(
        "/api/problem/create",
        {
          title: "A-B Input-Output Practice - (I)",
          description: "Your task is to Calculate A - B.",
          input_format:
            "Read first integer as no.of testcases and then read a and b for t times",
          output_format: "For each testcase print subtraction of a and b",
          constraints: "-1000 <= A, B <= 1000",
          sample_testcase: {
            input: "2\n2 1\n3 4",
            output: "1\n-1",
          },
          difficulty: "cakewalk",
          score: 10,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
      if (error.response.status === 405) {
        navigate("/login");
      }
    }
  };

  return (
    <div>
      <button onClick={createProblem}>Create Problem</button>
    </div>
  );
};

export default CreateProblem;

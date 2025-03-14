import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "../Header";
import { pagesCount } from "../../Common/constants";
import SubmissionModal from "./SubmissionViewPage";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [recordsPerPage, setRecordsPerPage] = useState(pagesCount[0]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const fetchSubmissions = async () => {
    const token = Cookies.get("neo_code_jwt_token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const response = await axios.get(
        `/api/problem/submissions?limit=${recordsPerPage}&skip=${
          (page - 1) * recordsPerPage
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubmissions(response.data.submissions);
      setTotalRecords(response.data.totalSubmissions);
      setTotalPages(Math.ceil(response.data.totalSubmissions / recordsPerPage));
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [page, recordsPerPage]);

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
    <div className="bg-black/95 min-h-screen px-10 pb-10 text-white">
      <Header />
      <div className="pt-28">
        <h1 className="text-2xl font-bold font-mono mb-6">Submissions Page</h1>

        <div className="mb-4 flex justify-between items-center">
          <div>
            <label className="text-sm font-medium">Records Per Page: </label>
            <select
              value={recordsPerPage}
              onChange={(e) => {
                setPage(1);
                setRecordsPerPage(Number(e.target.value));
              }}
              className="bg-black/70 text-white p-2 rounded-md border border-gray-700 ml-2"
            >
              {pagesCount.map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
              {totalRecords > 100 && (
                <option value={totalRecords}>All ({totalRecords})</option>
              )}
            </select>
          </div>
          <div className="text-sm text-gray-300">
            Total Records: {totalRecords}
          </div>
        </div>

        {submissions.length > 0 ? (
          <div className="space-y-4">
            {openModal && (
              <>
                {console.log(selectedSubmission)}
                <SubmissionModal
                  submissionResult={selectedSubmission}
                  theme="vs-dark"
                  setOpenModal={setOpenModal}
                />
              </>
            )}
            {submissions.map((submission, index) => (
              <div
                key={index}
                className="bg-black/70 hover:bg-white/5 p-3 rounded-lg shadow-lg border border-white/10 w-full flex flex-col md:flex-row items-center md:items-start justify-between cursor-pointer"
                onClick={() => {
                  setSelectedSubmission(submission);
                  setOpenModal(true);
                }}
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">
                    {submission.problem_title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Language: {submission.language}
                  </p>
                </div>

                <div className="text-center md:text-right">
                  <p className={`text-sm font-bold`}>
                    Verdict:{" "}
                    <span
                      className={`${
                        submission.verdict === "ACCEPTED"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {submission.verdict}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Submitted on:{" "}
                    {new Date(submission.submission_time).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="my-4">
            <h1 className="text-gray-300">No Submissions Found</h1>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center transition-all bg-transparent w-full mt-28">
            <div className="fixed bottom-10 w-[90%] bg-black/50 p-4 flex justify-between items-center space-x-2 border border-white/20 rounded-xl backdrop-blur-md">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className={`px-4 py-2 rounded-md border ${
                  page === 1
                    ? "border-gray-700 text-gray-500 cursor-not-allowed"
                    : "border-gray-400 hover:bg-gray-700"
                } transition`}
              >
                Prev
              </button>

              <div className="flex space-x-4">
                {totalPages <= 10 ? (
                  [...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i + 1)}
                      className={`px-3 py-2 rounded-md ${
                        page === i + 1
                          ? "bg-gray-700 text-white font-bold"
                          : "border border-gray-500 text-gray-300 hover:bg-gray-700"
                      } transition`}
                    >
                      {i + 1}
                    </button>
                  ))
                ) : (
                  <>
                    <button
                      onClick={() => setPage(1)}
                      className={`px-3 py-2 rounded-md ${
                        page === 1
                          ? "bg-gray-700 text-white font-bold"
                          : "border border-gray-500 text-gray-300 hover:bg-gray-700"
                      } transition`}
                    >
                      1
                    </button>

                    {/* Dots before current page */}
                    {page > 3 && (
                      <span className="text-gray-400 px-2">...</span>
                    )}

                    {/* Middle pages (dynamic range) */}
                    {Array.from({ length: 5 }, (_, i) => page - 2 + i)
                      .filter((p) => p > 1 && p < totalPages)
                      .map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-2 rounded-md ${
                            page === p
                              ? "bg-gray-700 text-white font-bold"
                              : "border border-gray-500 text-gray-300 hover:bg-gray-700"
                          } transition`}
                        >
                          {p}
                        </button>
                      ))}

                    {/* Dots after current page */}
                    {page < totalPages - 3 && (
                      <span className="text-gray-400 px-2">...</span>
                    )}

                    {/* Last Page */}
                    <button
                      onClick={() => setPage(totalPages)}
                      className={`px-3 py-2 rounded-md ${
                        page === totalPages
                          ? "bg-gray-700 text-white font-bold"
                          : "border border-gray-500 text-gray-300 hover:bg-gray-700"
                      } transition`}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={page === totalPages}
                className={`px-4 py-2 rounded-md border ${
                  page === totalPages
                    ? "border-gray-700 text-gray-500 cursor-not-allowed"
                    : "border-gray-400 hover:bg-gray-700"
                } transition`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submissions;

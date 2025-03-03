import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useUser } from "../../context/UserContext";
import Cookies from "js-cookie";
import { Oval } from "react-loader-spinner";
import axios from "axios";
import { LuTrash2 } from "react-icons/lu";

const profileApiStatusConstant = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const savedSnippetsApiStatusConstant = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Profile = () => {
  const { userData, updateUserData } = useUser();
  const [profileApiStatus, setProfileApiStatus] = useState(
    profileApiStatusConstant.initial
  );
  const [savedSnippetsApiStatus, setSavedSnippetsApiStatus] = useState(
    savedSnippetsApiStatusConstant.initial
  );
  const [savedSnippets, setSavedSnippets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("neo_code_jwt_token");
    if (jwtToken === undefined) {
      navigate("/login");
      return;
    }

    if (!userData) {
      fetchUserData();
    } else {
      setProfileApiStatus(profileApiStatusConstant.success);
    }
    fetchSavedSnippets();
  }, [userData, navigate]);

  const fetchSavedSnippets = async () => {
    setSavedSnippetsApiStatus(savedSnippetsApiStatusConstant.inProgress);
    const token = Cookies.get("neo_code_jwt_token");
    try {
      const response = await axios("/api/snippets/get-all-snippets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedSnippets(response.data.result);
      console.log(response);
      setSavedSnippetsApiStatus(savedSnippetsApiStatusConstant.success);
    } catch (error) {
      setSavedSnippetsApiStatus(savedSnippetsApiStatusConstant.failure);
      console.log(error);
    }
  };

  const handleDeleteSnippet = async (snippetId) => {
    const token = Cookies.get("neo_code_jwt_token");
    try {
      const response = await axios.delete(
        `/api/snippets/delete-snippet/${snippetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      fetchSavedSnippets();
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    setProfileApiStatus(profileApiStatusConstant.inProgress);
    try {
      const response = await axios.get("/api/user/profile", {
        headers: {
          Authorization: `Bearer ${Cookies.get("neo_code_jwt_token")}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        updateUserData(data.user);
        setProfileApiStatus(profileApiStatusConstant.success);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setProfileApiStatus(profileApiStatusConstant.failure);
      if (error.response?.status === 405) navigate("/login");
    }
  };

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

  const renderSuccessProfilePage = () => (
    <div className="w-full">
      <div className="bg-black/70 border border-white/20 rounded-lg p-6">
        {/* <h1 className="text-lg text-white mb-4">Profile</h1> */}
        <div className="text-white">
          <h1 className="text-2xl font-mono">{userData.username}</h1>
          {console.log(userData)}
        </div>
      </div>
    </div>
  );

  const renderFailureProfilePage = () => (
    <div className="text-center text-white mt-10">
      <h2 className="text-2xl font-semibold">Failed to fetch profile</h2>
      <p className="text-lg">Please try again later.</p>
    </div>
  );

  const renderProfileComponent = () => {
    switch (profileApiStatus) {
      case profileApiStatusConstant.success:
        return renderSuccessProfilePage();
      case profileApiStatusConstant.failure:
        return renderFailureProfilePage();
      case profileApiStatusConstant.inProgress:
        return renderLoader();
      default:
        return null;
    }
  };

  const SnippetCard = ({ snippet }) => {
    const navigate = useNavigate();

    const handleGoToSnippet = () => {
      navigate("/compiler", {
        state: {
          title: snippet.title,
          sourceCode: snippet.code,
          explanation: snippet.explanation,
          language: snippet.language,
        },
      });
    };

    return (
      <div className="bg-black/70 border border-white/20 p-4 text-white w-[260px] h-[160px] rounded-lg shadow-lg flex flex-col justify-between">
        <div className="flex justify-between">
          <h1 className="font-semibold font-mono">{snippet.title}</h1>
          <button
            onClick={() => handleDeleteSnippet(snippet.id)}
            className="text-red-500 border border-red-500 rounded-lg p-1 hover:text-red-600 transition-colors duration-300 self-start"
          >
            <LuTrash2 />
          </button>
        </div>
        <>
          <h1>
            Language: <span>{snippet.language}</span>
          </h1>
          <h1>{new Date(snippet.updated_at).toDateString()}</h1>
        </>
        <button
          onClick={handleGoToSnippet}
          className="mt-1 border border-blue-500 rounded-lg px-2 py-1 text-sm text-blue-500 hover:bg-blue-500 hover:text-white transition-colors duration-300"
        >
          Go to Snippet
        </button>
      </div>
    );
  };

  const renderSuccessSavedSnippetsPage = () => {
    return (
      <div className="">
        {savedSnippets.length === 0 ? (
          <div className="flex justify-center">
            <h1 className="text-white/60">No Saved Snippets</h1>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {savedSnippets.map((snippet) => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderFailureSavedSnippetsPage = () => (
    <div className="text-center text-white mt-10">
      <h2 className="text-2xl font-semibold">Failed to fetch Saved Snippets</h2>
      <p className="text-lg">Please try again later.</p>
    </div>
  );

  const renderSavedSnippetsComponent = () => {
    switch (savedSnippetsApiStatus) {
      case savedSnippetsApiStatusConstant.success:
        return renderSuccessSavedSnippetsPage();
      case savedSnippetsApiStatusConstant.failure:
        return renderFailureSavedSnippetsPage();
      case savedSnippetsApiStatusConstant.inProgress:
        return renderLoader();
      default:
        return null;
    }
  };

  return (
    <div className="bg-black/95 min-h-screen">
      <Header />
      <div className="pt-28 px-12">
        <div className="flex gap-2 w-full h-[60vh]">
          <div className="w-1/3 h-full flex flex-col justify-start items-center">
            {renderProfileComponent()}
          </div>
          <div className="w-2/3 h-full">{}</div>
        </div>
        <hr className="border-b border-white/20" />
        <div className="pt-4 pb-10">
          <h1 className="text-white text-3xl">Saved Snippets</h1>
          <div className="pt-4">{renderSavedSnippetsComponent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

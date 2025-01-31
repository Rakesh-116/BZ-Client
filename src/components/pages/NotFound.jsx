import Header from "./Header";
import zoro from "../../assets/zoro-s.png";

const NotFound = () => (
  <>
    <Header />
    <div className="pl-[10%] h-screen bg-black text-white w-full flex justify-center items-center font-semibold font-mono">
      <h1>Aw..! snap, Page Not Found</h1>
      <img src={zoro} className="w-[400px]" />
    </div>
  </>
);

export default NotFound;

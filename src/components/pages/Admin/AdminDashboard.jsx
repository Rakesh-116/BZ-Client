import React from "react";
import Header from "../Header";

const AdminDashboard = () => {
  return (
    <div className="bg-black/95 min-h-screen">
      <Header />
      <div className="mt-28 px-10">
        <h1 className="text-2xl font-mono text-white">Admin Dashboard</h1>
      </div>
    </div>
  );
};

export default AdminDashboard;

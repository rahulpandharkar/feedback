import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import '../App.css'; // Assuming your CSS is in App.css

const ProtectedRoute = ({ children }) => {
  const { user } = useUserAuth();

  console.log("Check user in Private: ", user);
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;

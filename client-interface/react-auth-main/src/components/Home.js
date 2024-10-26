import React, { useState } from "react";
import { Button, Alert } from "react-bootstrap";
import { useUserAuth } from "../context/UserAuthContext";
import ImageUpload from "./ImageUpload";
import { useNavigate } from "react-router";
import { FaSignOutAlt, FaRobot, FaBook, FaPaperPlane } from "react-icons/fa"; // Icons import
import '../App.css'; // Assuming your CSS is in App.css

const Home = () => {
  const { logOut, user } = useUserAuth();
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUploadComplete = async (suggestions) => {
    setSuggestions(suggestions);
    setError("");
  };

  const handleSubmit = async () => {
    try {
      await fetch(
        "your_database_url_here",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            email: user.email,
            suggestions: suggestions,
            location: location,
          }),
        }
      );
      alert("Data successfully submitted");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Error submitting your selection.");
    }
  };

  return (
    <div className="home-container">
      <h1 className="text-center">Welcome</h1><br />

      <div className="mt-3">
        <input
          type="text"
          placeholder="Enter your Name"
          value={name}
          style={{ width: '360px' }}
          onChange={(e) => setName(e.target.value)}
        /><br />

        <input
          type="text"
          placeholder="Enter your Location"
          value={location}
          style={{ width: '360px', marginTop: '15px' }}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div><br />

      <ImageUpload onUploadComplete={handleUploadComplete} />
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="suggestion-item">{suggestions}</div><br />

      {/* Icons Section */}
      <div className="icons-container">
        <div className="icon-item" onClick={handleSubmit}>
          <FaPaperPlane size={24} />
          <span>Submit</span>
        </div>
        <div className="icon-item" onClick={handleLogout}>
          <FaSignOutAlt size={24} />
          <span>Log Out</span>
        </div>
        <div className="icon-item" onClick={() => navigate('/manual')}>
          <FaBook size={24} />
          <span>Manual</span>
        </div>
        <div className="icon-item" onClick={() => navigate("/chatbot")}>
          <FaRobot size={24} />
          <span>Chatbot</span>
        </div>
      </div>
    </div>
  );
};

export default Home;

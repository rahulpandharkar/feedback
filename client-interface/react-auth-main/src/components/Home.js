
// // Home.js
// import React, { useState } from "react";
// import { Button, Alert } from "react-bootstrap";
// import { useUserAuth } from "../context/UserAuthContext";
// import ImageUpload from "./ImageUpload";
// import { useNavigate, useLocation } from "react-router";
// import '../App.css'; // Assuming your CSS is in App.css



// const Home = () => {
//   const { logOut, user } = useUserAuth();
//   const [suggestions, setSuggestions] = useState([]);
//   const [selectedSuggestions, setSelectedSuggestions] = useState([]); // Changed to array for multiple selections
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [location, setLocation] = useState(""); // New state for location



//   const handleLogout = async () => {
//     try {
//       await logOut();
//       navigate("/");
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const handleUploadComplete = async (suggestions) => {
//     setSuggestions(suggestions);
//     console.log(selectedSuggestions); // Set suggestions received from upload
//     setError(""); // Clear any previous error
//   };

//   const handleSubmit = async () => {

//     try {
//       const response = await fetch(
//         "https://hackathon24-727c9-default-rtdb.firebaseio.com/user.json",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             name: name,
//             email: user.email,
//             suggestions: suggestions,
//             location: location,
//           }),
//         }
//       );
//       alert("data successfully submitted");
//       window.location.reload();


//     } catch (err) {
//       console.error(err);
//       alert("Error submitting your selection.");
//     }
//   };

//   return (
//     <>
//       <h1 className="p-4 box mt-3 text-center">
//         Welcome <br />
//       </h1><br />
//       {/* Input for Name */}
//       <div className="mt-3">
//         <input
//           type="text"
//           placeholder="Enter your name"
//           value={name}
//           style={{ width: '360px' }}
//           onChange={(e) => setName(e.target.value)}
//         /><br />
//         {/* Input for Location */}
//         <div className="mt-3">
//           <input
//             type="text"
//             placeholder="Enter your location"
//             value={location}
//             style={{ width: '360px' }}
//             onChange={(e) => setLocation(e.target.value)}
//           /></div><br />
//       </div>
//       <ImageUpload onUploadComplete={handleUploadComplete} />
//       {error && <Alert variant="danger">{error}</Alert>}
//       <div className="suggestion-item">
//         {suggestions}
//       </div><br />
//       <div className="d-grid gap-2">
//         <Button variant="primary" onClick={handleSubmit}>
//           Submit
//         </Button>
//       </div>
//       <br />
//       <div className="d-grid gap-2">
//         <Button variant="primary" onClick={handleLogout}>
//           Log out
//         </Button>
//       </div>
//       <div className="d-grid gap-2">
//         <Button variant="primary" onClick={() => navigate('/manual')}>
//           Manual
//         </Button>
//         <Button variant="primary" onClick={() => navigate("/chatbot")}>
//           Chatbot
//         </Button>
//       </div>
//     </>
//   );
// };

// export default Home;




// // // Home.js
// // import React, { useState } from "react";
// // import { Button, Alert } from "react-bootstrap";
// // import { useUserAuth } from "../context/UserAuthContext";
// // import ImageUpload from "./ImageUpload";
// // import { useNavigate } from "react-router";

// // const Home = () => {
// //   const { logOut, user } = useUserAuth();
// //   const [suggestions, setSuggestions] = useState([]);
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();
// //   const [name, setName] = useState("");
// //   const [location, setLocation] = useState(""); // New state for location
// //   const [imageUrl, setImageUrl] = useState(""); // New state for image URL

// //   const handleLogout = async () => {
// //     try {
// //       await logOut();
// //       navigate("/");
// //     } catch (error) {
// //       console.log(error.message);
// //     }
// //   };

// //   const handleUploadComplete = async (url) => {
// //     setImageUrl(url); // Set the image URL received from upload
// //     setSuggestions([]); // Reset suggestions if needed
// //     setError(""); // Clear any previous error
// //   };

// //   const handleSubmit = async () => {
// //     try {
// //       const response = await fetch(
// //         "https://console.firebase.google.com/project/hackathon24-727c9/storage/hackathon24-727c9.appspot.com/files",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //           },
// //           body: JSON.stringify({
// //             name: name,
// //             email: user.email,
// //             suggestions: suggestions,
// //             location: location,
// //             imageUrl: imageUrl, // Include image URL in submission
// //           }),
// //         }
// //       );

// //       if (!response.ok) {
// //         throw new Error("Failed to submit data");
// //       }
// //     } catch (err) {
// //       console.error(err);
// //       alert("Error submitting your selection.");
// //     }
// //   };

// //   return (
// //     <>
// //       <div className="p-4 box mt-3 text-center">
// //         Welcome <br />
// //         {user && user.email}
// //       </div>
// //       {/* Input for Name */}
// //       <div className="mt-3">
// //         <input
// //           type="text"
// //           placeholder="Enter your name"
// //           value={name}
// //           onChange={(e) => setName(e.target.value)}
// //         />
// //         {/* Input for Location */}
// //         <div className="mt-3">
// //           <input
// //             type="text"
// //             placeholder="Enter your location"
// //             value={location}
// //             onChange={(e) => setLocation(e.target.value)}
// //           />
// //         </div>
// //       </div>
// //       <ImageUpload onUploadComplete={handleUploadComplete} />
// //       {error && <Alert variant="danger">{error}</Alert>}
// //       <div className="suggestion-item">
// //         {suggestions}
// //       </div>
// //       <div className="mt-3">
// //         <Button variant="primary" onClick={handleSubmit}>
// //           Submit
// //         </Button>
// //       </div>
// //       <div className="d-grid gap-2">
// //         <Button variant="primary" onClick={handleLogout}>
// //           Log out
// //         </Button>
// //       </div>
// //     </>
// //   );
// // };

// // export default Home;
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

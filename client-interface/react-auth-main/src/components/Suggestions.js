// Suggestions.js
import React from "react";
import { Form } from "react-bootstrap";
import '../App.css'; // Assuming your CSS is in App.css


const Suggestions = ({ suggestions, onSelect }) => {
  return (
    <div className="p-4 box">
      <h2 className="mb-3">Select the relevant issue</h2>
      <Form>
        {suggestions.map((suggestion, index) => (
          <Form.Check
            key={index}
            type="radio"
            label={suggestion}
            name="suggestion"
            onChange={() => onSelect(suggestion)}
          />
        ))}
      </Form>
    </div>
  );
};

export default Suggestions;

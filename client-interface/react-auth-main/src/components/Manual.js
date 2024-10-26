import React from 'react';
import './Manual.css'; // Import the CSS file for styling

const Manual = () => {
  return (
    <div className="manual-container">
      <h2>User Manual</h2>
      <p>Welcome to the User Manual! This section will guide you on how to use the application effectively.</p>

      <h3>Features</h3>
      <ul>
        <li><strong>Image Upload:</strong> Capture or upload images of anomalies you encounter.</li>
        <li><strong>Suggestions:</strong> After uploading, you will receive suggestions based on the image.</li>
        <li><strong>Location Input:</strong> Enter your location to help us address the issues effectively.</li>
        <li><strong>Submission:</strong> Submit your feedback along with your name and email for follow-up.</li>
      </ul>

      <h3>Step-by-Step Guide</h3>
      <ol>
        <li>Select an image to upload or use the capture feature.</li>
        <li>Review the suggestions provided after the upload.</li>
        <li>Enter your name and location in the provided fields.</li>
        <li>Click on the "Submit" button to send your feedback.</li>
      </ol>

      <h3>Contact Support</h3>
      <p>If you encounter any issues or have questions, please contact our support team at <a href="mailto:support@example.com">support@example.com</a>.</p>
    </div>
  );
};

export default Manual;

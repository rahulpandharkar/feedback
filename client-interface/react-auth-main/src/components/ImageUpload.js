// ImageUpload.js
import React, { useRef, useState } from "react";
import { Button, Alert } from "react-bootstrap";
import '../App.css'; // Assuming your CSS is in App.css


const ImageUpload = ({ onUploadComplete }) => {
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setError("");
        }
    };

    const handleCaptureClick = () => {
        const video = document.createElement("video");
        const constraints = { video: true };

        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                video.srcObject = stream;
                video.play();
                document.body.appendChild(video);

                const captureButton = document.createElement("button");
                captureButton.innerText = "Capture";
                document.body.appendChild(captureButton);

                captureButton.onclick = () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const context = canvas.getContext("2d");
                    context.drawImage(video, 0, 0);

                    canvas.toBlob((blob) => {
                        const imageFile = new File([blob], "capturedImage.png", {
                            type: "image/png",
                        });
                        setImageFile(imageFile); // Set captured image file
                        onUploadComplete(imageFile); // Pass the captured image to the parent
                        setError("");
                    });

                    // Stop video stream and remove elements
                    stream.getTracks().forEach((track) => track.stop());
                    video.remove();
                    captureButton.remove();
                };
            })
            .catch((err) => {
                console.error("Error accessing camera: ", err);
                setError("Unable to access the camera.");
            });
    };

    const handleUpload = async () => {
        if (imageFile) {
            try {
                // Create FormData to send the image file
                const formData = new FormData();
                console.log("This is form data");
                console.log(formData[0]);
                formData.append("image", imageFile);
                for (let pair of formData.entries()) {
                    console.log(`${pair[0]}: ${pair[1].name || pair[1]}`);
                }


                // Send the image file to the backend
                const response = await fetch("http://127.0.0.1:5000/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error("Failed to upload image");
                }

                const data = await response.json();
                console.log(data);
                onUploadComplete(data.suggestions); // Pass the response data (suggestions) to the parent
                // setImageFile(null); // Clear the state after upload
            } catch (error) {
                setError("Error uploading image: " + error.message);
            }
        } else {
            setError("Please select or capture an image first.");
        }
    };

    return (
        <div className="image-upload">
            <h4>Upload or Capture an Image</h4>
            <br />
            {error && <Alert variant="danger">{error}</Alert>}
            <div className="mb-3">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
                <Button style={{ width: '360px' }} onClick={() => fileInputRef.current.click()}>Select Image</Button>
            </div>
            <Button variant="primary" style={{ width: '360px' }} onClick={handleCaptureClick}>
                Capture Image
            </Button>
            <br />
            <br />
            <Button variant="success" style={{ width: '360px' }} onClick={handleUpload}>
                Upload
            </Button>
            <br />
            {imageFile && (
                <div className="mt-3">
                    <br />
                    <h5>Image Preview:</h5>
                    <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Preview"
                        style={{ maxWidth: "100%", height: "auto" }}
                    />
                </div>
            )}
        </div>
    );
};

export default ImageUpload;

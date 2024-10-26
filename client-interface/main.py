import pathlib
import textwrap
import google.generativeai as genai
import PIL.Image
import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

# Configure API Key
GOOGLE_API_KEY = 'your_google_api_key'
genai.configure(api_key=GOOGLE_API_KEY)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def format_response(response):
    """
    1. Remove '>' symbols.
    2. Replace multiple spaces/newlines with a single space.
    3. Ensure the result is a clean sentence.
    """
    # Remove '>' and any unwanted characters, keep only letters/numbers/spaces
    cleaned_response = re.sub(r'[^\w\s]', '', response)

    # Replace multiple spaces/newlines with a single space
    single_line_response = re.sub(r'\s+', ' ', cleaned_response)

    # Strip leading/trailing spaces and capitalize the sentence
    formatted_response = single_line_response.strip().capitalize()

    return formatted_response


@app.route('/chatbot', methods=['POST'])
def chat_bot():
    """Endpoint to handle chatbot interactions."""
    logger.debug("Request received for chatbot interaction.")

    # Check if the request contains JSON data
    if not request.is_json:
        logger.error("Request must be JSON.")
        return jsonify({"error": "Request must be JSON"}), 400
    
    data = request.get_json()
    user_input = data.get('message')  # Extract message from the request body

    if not user_input:
        logger.error("No message provided.")
        return jsonify({"error": "No message provided"}), 400

    try:
        # Initialize the GenerativeModel with Gemini
        model = genai.GenerativeModel("gemini-1.5-flash")

        # Generate content based on user input
        result = model.generate_content([user_input])
        logger.info("Content generated successfully.")

        return jsonify({"response": format_response(to_markdown(result.text))})

    except Exception as e:
        logger.exception("An error occurred during chatbot processing.")
        return jsonify({"error": str(e)}), 500

def to_markdown(text):
    """Format text to look like Markdown-style."""
    text = text.replace('•', '  *')
    return textwrap.indent(text, '> ', predicate=lambda _: True)

@app.route('/upload', methods=['POST'])
def upload_image():
    """Endpoint to handle image uploads."""
    logger.debug("Request received to upload an image.")
    
    if 'image' not in request.files:
        logger.error("No file part in the request.")
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['image']
    
    if file.filename == '':
        logger.error("No selected file.")
        return jsonify({"error": "No selected file"}), 400

    try:
        # Save the uploaded image temporarily
        img_file_path = f"temp_{file.filename}"
        file.save(img_file_path)
        logger.info(f"Image saved temporarily at {img_file_path}.")

        # Use 'with' statement to ensure the file is closed after use
        with PIL.Image.open(img_file_path) as img:
            logger.info("Image opened successfully.")

            # Upload the image to the Generative AI API
            myfile = genai.upload_file(img_file_path)
            logger.info(f"Uploaded file: {myfile}")

            # Initialize the GenerativeModel with Gemini
            model = genai.GenerativeModel("gemini-1.5-flash")

            # Custom prompt to detect issues
            custom_prompt = (
                "Describe this image in three words max. "
                "Also, identify any anomalies or problems depicted "
                "in five to six words."
            )

            # Generate content based on the image and prompt
            result = model.generate_content([myfile, "\n\n", custom_prompt])
            logger.info("Content generated successfully.")

        # Clean up the temporary file
        os.remove(img_file_path)
        logger.info(f"Temporary file {img_file_path} removed.")
        print(to_markdown(result.text))
        return jsonify({"suggestions": to_markdown(result.text)})

    except Exception as e:
        logger.exception("An error occurred during image processing.")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)  # Set debug=True to enable debug mode

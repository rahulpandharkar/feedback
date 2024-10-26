import os
import torch
import pandas as pd
import folium
import matplotlib.pyplot as plt
from transformers import AutoTokenizer, AutoModelForCausalLM
from huggingface_hub import login
from collections import Counter
from folium.plugins import HeatMap
from wordcloud import WordCloud
from flask import Flask, render_template, send_file, abort
import logging

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Define the model name and directory
model_name = "meta-llama/Llama-3.2-1B"
model_dir = "./llama-models/model"
tokenizer_dir = "./llama-models/tokenizer"

# Login to Hugging Face Hub
login("add_your_llama_api_key")

# Check if the model already exists; if not, download it
if not os.path.exists(model_dir):
    logging.info(f"Downloading model {model_name}...")
    model = AutoModelForCausalLM.from_pretrained(model_name)
    os.makedirs(model_dir, exist_ok=True)
    model.save_pretrained(model_dir)
    logging.info("Model downloaded and saved successfully.")
else:
    logging.info("Model already exists.")

# Check if the tokenizer already exists; if not, download it
if not os.path.exists(tokenizer_dir):
    logging.info(f"Downloading tokenizer for {model_name}...")
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    os.makedirs(tokenizer_dir, exist_ok=True)
    tokenizer.save_pretrained(tokenizer_dir)
    logging.info("Tokenizer downloaded and saved successfully.")
else:
    logging.info("Tokenizer already exists.")

# Load the tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(tokenizer_dir)
model = AutoModelForCausalLM.from_pretrained(model_dir, local_files_only=True)

# Move the model to GPU if available
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

# Set the pad token id to avoid warnings
tokenizer.pad_token = tokenizer.eos_token
model.config.pad_token_id = tokenizer.pad_token_id

# Read the data from the CSV file
csv_file_path = 'dataset.csv'  # Update this path to where your CSV is located

# Process the data and generate visualizations
def process_data():
    try:
        logging.info("Checking for CSV file...")
        if not os.path.exists(csv_file_path):
            logging.error(f"CSV file not found: {csv_file_path}")
            abort(404)

        df = pd.read_csv(csv_file_path)

        # Print loaded data for debugging
        logging.info(f"Data loaded with shape: {df.shape}")

        # Check if necessary columns are present
        required_columns = ['Issues', 'Latitude', 'Longitude']
        for col in required_columns:
            if col not in df.columns:
                logging.error(f"Required column missing: {col}")
                abort(500)

        # Group by category and summarize issues
        hot_topics = {'Hospital': [], 'School': [], 'Transport': []}
        issue_counter = {'Hospital': 0, 'School': 0, 'Transport': 0}
        keyword_counter = {'Hospital': Counter(), 'School': Counter(), 'Transport': Counter()}

        keywords = {
            'Hospital': ['wall', 'staff', 'cleanliness', 'equipment', 'overcrowding'],
            'School': ['bench', 'crowded', 'cleanliness', 'staff'],
            'Transport': ['pothole', 'light', 'transport', 'road']
        }

        for index, row in df.iterrows():
            issue = row['Issues'].lower()
            for category, words in keywords.items():
                if any(word in issue for word in words):
                    hot_topics[category].append(issue)
                    issue_counter[category] += 1
                    keyword_counter[category].update([word for word in words if word in issue])

        prompt = "Here are the most reported issues in different categories:\n"
        for category, issues in hot_topics.items():
            if issues:
                most_common_issue = Counter(issues).most_common(1)
                prompt += f"In {category}, the most reported issue is: {most_common_issue[0][0]}.\n"

        input_ids = tokenizer.encode(prompt, return_tensors="pt").to(device)
        attention_mask = (input_ids != tokenizer.pad_token_id).type(torch.int)

        with torch.no_grad():
            output = model.generate(
                input_ids=input_ids,
                attention_mask=attention_mask,
                max_length=100,
                num_return_sequences=1,
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.2,
                do_sample=True,
            )

        generated_text = tokenizer.decode(output[0], skip_special_tokens=True)
        logging.info("Text generated successfully.")

        # Generate the heatmap
        mumbai_map = folium.Map(location=[19.0760, 72.8777], zoom_start=12)
        heat_data = [[row['Latitude'], row['Longitude']] for index, row in df.iterrows() if 'Latitude' in row and 'Longitude' in row]
        HeatMap(heat_data).add_to(mumbai_map)

        # Save the map to an HTML file
        mumbai_map_file = "static/mumbai_map.html"
        mumbai_map.save(mumbai_map_file)

        # Generate the pie chart using non-GUI backend
        plt.switch_backend('Agg')  # Switch to a non-interactive backend
        issue_counts = pd.Series(issue_counter)
        issue_percentages = (issue_counts / issue_counts.sum()) * 100
        pie_chart_file = "static/pie_chart.png"

        plt.figure(figsize=(10, 6))
        plt.pie(issue_percentages, labels=issue_percentages.index, autopct='%1.1f%%', startangle=140)
        plt.title('Percentage of Issues Reported by Category in Mumbai')
        plt.axis('equal')
        plt.savefig(pie_chart_file)
        plt.close()
        logging.info("Pie chart generated successfully.")

        # Generate word clouds
        wordcloud_files = {}
        for category, counts in keyword_counter.items():
            if counts:
                wordcloud = WordCloud(width=800, height=400, background_color='white').generate_from_frequencies(counts)
                wordcloud_file = f'wordcloud_{category}.png'
                wordcloud.to_file(wordcloud_file)
                wordcloud_files[category] = wordcloud_file

        logging.info("Word clouds generated successfully.")
        return generated_text, mumbai_map_file, pie_chart_file, wordcloud_files
    except Exception as e:
        logging.error(f"Error processing data: {e}")
        abort(500)

@app.route('/generate')
def generate_report():
    try:
        generated_text, mumbai_map_file, pie_chart_file, wordcloud_files = process_data()
        return {
            'summary': generated_text,
            'map': mumbai_map_file,
            'pie_chart': pie_chart_file,
            'wordclouds': wordcloud_files
        }
    except Exception as e:
        logging.error(f"Error generating report: {e}")
        return {'error': str(e)}, 500        

@app.route('/')
def home():
    try:
        generated_text, mumbai_map_file, pie_chart_file, wordcloud_files = process_data()
        return render_template('index.html', generated_text=generated_text, mumbai_map_file=mumbai_map_file, pie_chart_file=pie_chart_file, wordcloud_files=wordcloud_files)
    except Exception as e:
        logging.error(f"Error in home route: {e}")
        abort(500)

@app.route('/wordcloud/<category>')
def wordcloud(category):
    wordcloud_file = f'wordcloud_{category}.png'
    if not os.path.exists(wordcloud_file):
        logging.error(f"Wordcloud file {wordcloud_file} not found.")
        abort(404)
    return send_file(wordcloud_file)

if __name__ == '__main__':
    app.run(debug=False)  # Start on port 8080cls

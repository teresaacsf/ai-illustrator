from flask import Flask, jsonify, request, send_file
import requests
import base64
from io import BytesIO
import logging
import yake



app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)

api_host = 'https://api.stability.ai'
api_key = 'sk-4dja7f8u4MPGDUqszTsSsIWIfnmZNPonoWtnUOxiQlAtzQWH'
engine_id = 'stable-diffusion-xl-beta-v2-2-2'

# Serve the static files (HTML and JavaScript)
@app.route('/')
def index():
    return app.send_static_file('index.html')

# Favicon handler
@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/models', methods=['GET'])
def get_model_list():
    url = f"{api_host}/v1/engines/list"
    response = requests.get(url, headers={"Authorization": f"Bearer {api_key}"})

    if response.status_code == 200:
        payload = response.json()
        return jsonify(payload), 200

    return jsonify({"error": "Failed to retrieve model list"}), 500


@app.route('/extract_keywords', methods=['POST'])
def extract_keywords():
    doc = request.form.get('doc')
    print(doc)
    
    # Perform keyword extraction using yake
    kw_extractor = yake.KeywordExtractor()
    keywords = kw_extractor.extract_keywords(doc)
    extracted_keywords = [kw[0] for kw in keywords]

    return jsonify({"keywords": extracted_keywords}), 200



@app.route('/generate', methods=['POST'])
def generate_image():
    prompt = request.json.get('prompt')
    height = request.json.get('height')
    width = request.json.get('width')
    steps = request.json.get('steps')

    url = f"{api_host}/v1/generation/{engine_id}/text-to-image"
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "text_prompts": [{"text": f"{prompt}"}],
        "cfg_scale": 7,
        "clip_guidance_preset": "FAST_BLUE",
        "height": height,
        "width": width,
        "samples": 1,
        "steps": steps
    }

    response = requests.post(url, headers=headers, json=payload)


    if response.status_code == 200:
        data = response.json()
        images = []
        for i, image in enumerate(data["artifacts"]):
            encoded_image = image["base64"]
            image_data = base64.b64decode(encoded_image)
            image_stream = BytesIO(image_data)
            return send_file(image_stream, mimetype='image/png')

        return jsonify({"images": images}), 200
    
    app.logger.debug(response.text)
    return jsonify({"error": "Failed to generate image"}), 500



if __name__ == '__main__':
    app.run()
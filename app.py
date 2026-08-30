import os
import io
import json
import base64
import numpy as np
from PIL import Image

# Set default backend for Keras 3 (supports torch / tensorflow / jax)
if "KERAS_BACKEND" not in os.environ:
    os.environ["KERAS_BACKEND"] = "torch"

import keras
from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder="static", template_folder="templates")
app.config["TEMPLATES_AUTO_RELOAD"] = True
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0
CORS(app)

# Load class names
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), "class_names.json")
with open(CLASS_NAMES_PATH, "r") as f:
    CLASS_NAMES = json.load(f)

# Load trained Keras model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "fruit_classifier_mobilenetv2.keras")
print(f"Loading trained model from {MODEL_PATH}...")
model = keras.models.load_model(MODEL_PATH)
print("Model loaded successfully!")

# Fruit metadata: nutritional facts, emojis, fun facts, and color accents
FRUIT_METADATA = {
    "Apple": {
        "emoji": "🍎",
        "color": "#ef4444",
        "light_color": "rgba(239, 68, 68, 0.15)",
        "calories": "52 kcal / 100g",
        "key_nutrients": "Dietary Fiber, Vitamin C, Potassium",
        "fun_fact": "Apples float in water because 25% of their volume is actually air!",
        "health_benefit": "Promotes heart health, aids digestion, and helps regulate blood sugar."
    },
    "Banana": {
        "emoji": "🍌",
        "color": "#eab308",
        "light_color": "rgba(234, 179, 8, 0.15)",
        "calories": "89 kcal / 100g",
        "key_nutrients": "Potassium, Vitamin B6, Vitamin C, Magnesium",
        "fun_fact": "Botanically, bananas are classified as berries, while strawberries are not!",
        "health_benefit": "Boosts sustained physical energy, supports cardiovascular function, and aids muscle recovery."
    },
    "Grape": {
        "emoji": "🍇",
        "color": "#8b5cf6",
        "light_color": "rgba(139, 92, 246, 0.15)",
        "calories": "69 kcal / 100g",
        "key_nutrients": "Resveratrol, Vitamin K, Copper, Antioxidants",
        "fun_fact": "There are over 8,000 known grape varieties worldwide, grown across 6 continents.",
        "health_benefit": "Rich in powerful polyphenols that protect against oxidative stress and support arterial wellness."
    },
    "Mango": {
        "emoji": "🥭",
        "color": "#f97316",
        "light_color": "rgba(249, 115, 22, 0.15)",
        "calories": "60 kcal / 100g",
        "key_nutrients": "Vitamin A (Beta-Carotene), Vitamin C, Folate",
        "fun_fact": "Known as the 'King of Fruits', mangoes have been cultivated in South Asia for over 4,000 years.",
        "health_benefit": "Supports optimal eye vision, immune defense, and glowing skin elasticity."
    },
    "Strawberry": {
        "emoji": "🍓",
        "color": "#ec4899",
        "light_color": "rgba(236, 72, 153, 0.15)",
        "calories": "32 kcal / 100g",
        "key_nutrients": "Vitamin C, Manganese, Folate, Ellagitannins",
        "fun_fact": "Strawberries are the only fruit that wear their seeds on the outside — averaging 200 per berry!",
        "health_benefit": "Very low in calories, packed with anti-inflammatory antioxidants, and helps regulate blood lipids."
    }
}


def preprocess_image_bytes(image_bytes):
    """
    Validates, converts, and prepares image bytes for model prediction.
    Input size: 160x160 RGB.
    """
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.convert("RGB")
        img = img.resize((160, 160), Image.Resampling.BILINEAR)
        img_array = np.array(img, dtype=np.float32)

        # Check if the model has an internal Rescaling layer
        # If the model layers already contain Rescaling, pass [0, 255] float array
        has_rescaling_layer = any(
            "Rescaling" in layer.__class__.__name__ for layer in model.layers
        )
        if not has_rescaling_layer:
            img_array = (img_array / 127.5) - 1.0

        # Expand batch dimension (1, 160, 160, 3)
        img_batch = np.expand_dims(img_array, axis=0)
        return img_batch, None
    except Exception as e:
        return None, f"Image processing error: {str(e)}"


@app.route("/")
def index():
    return render_template("index.html", class_names=CLASS_NAMES, metadata=FRUIT_METADATA)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "healthy",
        "model": "MobileNetV2 Fruit Classifier",
        "classes": CLASS_NAMES,
        "test_accuracy": "91%",
        "input_resolution": "160x160"
    })


@app.route("/predict", methods=["POST"])
def predict():
    image_bytes = None

    # Handle standard multipart form file upload
    if "file" in request.files:
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected. Please choose a fruit image."}), 400
        image_bytes = file.read()

    # Handle base64 encoded data payload (e.g. from camera/drag-and-drop)
    elif request.is_json and "image_data" in request.json:
        raw_data = request.json["image_data"]
        if "," in raw_data:
            raw_data = raw_data.split(",", 1)[1]
        try:
            image_bytes = base64.b64decode(raw_data)
        except Exception:
            return jsonify({"error": "Malformed base64 image data received."}), 400

    if not image_bytes:
        return jsonify({"error": "No image provided. Please upload an image file."}), 400

    # Validate and preprocess image
    img_batch, err = preprocess_image_bytes(image_bytes)
    if err:
        return jsonify({"error": "Invalid image file. Please provide a valid JPEG, PNG, or WEBP image."}), 400

    # Run inference
    predictions = model.predict(img_batch, verbose=0)[0]
    predicted_idx = int(np.argmax(predictions))
    predicted_class = CLASS_NAMES[predicted_idx]
    confidence_score = float(predictions[predicted_idx])
    confidence_percentage = round(confidence_score * 100, 2)

    # Class probability breakdown
    probabilities = []
    for idx, name in enumerate(CLASS_NAMES):
        prob = float(predictions[idx])
        meta = FRUIT_METADATA.get(name, {})
        probabilities.append({
            "fruit": name,
            "emoji": meta.get("emoji", "🍎"),
            "probability": prob,
            "percentage": f"{round(prob * 100, 2):.2f}%",
            "score": round(prob * 100, 2),
            "color": meta.get("color", "#3b82f6")
        })

    # Sort probabilities descending
    probabilities.sort(key=lambda x: x["probability"], reverse=True)

    fruit_info = FRUIT_METADATA.get(predicted_class, {})

    return jsonify({
        "success": True,
        "predicted_fruit": predicted_class,
        "confidence": f"{confidence_percentage:.2f}%",
        "confidence_score": confidence_score,
        "confidence_percentage": confidence_percentage,
        "emoji": fruit_info.get("emoji", "🍎"),
        "probabilities": probabilities,
        "fruit_info": fruit_info
    })


@app.route("/static/samples/<path:filename>")
def serve_sample(filename):
    return send_from_directory(os.path.join(app.static_folder, "samples"), filename)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Fruit Classifier Web App on http://127.0.0.1:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)

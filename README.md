# 🍎 Fruit Classification AI Web Application

[![Accuracy](https://img.shields.io/badge/Test%20Accuracy-91%25-brightgreen.svg)](#model-specifications)
[![Model](https://img.shields.io/badge/Architecture-MobileNetV2-blue.svg)](#model-specifications)
[![Framework](https://img.shields.io/badge/Framework-TensorFlow%20%2F%20Keras-orange.svg)](#tech-stack)
[![Backend](https://img.shields.io/badge/Backend-Flask-lightgrey.svg)](#tech-stack)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](#license)

A modern, full-stack, production-ready web application for classifying fruit images in real-time using deep transfer learning with **MobileNetV2**.

---

## 🌟 Key Features

- **High Accuracy Visual Recognition**: Powered by a fine-tuned MobileNetV2 model achieving **91% test accuracy** across 5 fruit classes (**Apple, Banana, Grape, Mango, Strawberry**).
- **Modern Glassmorphic UI**: Premium responsive frontend with ambient glowing effects, smooth micro-animations, and fluid layout.
- **Multiple Input Methods**:
  - Drag-and-drop or file picker (JPEG, PNG, WEBP).
  - Integrated **live camera capture** for mobile and desktop webcam devices.
  - **1-Click sample test gallery** to test each fruit class immediately without searching for photos.
- **Detailed Confidence Breakdown**: Animated progress bars showing probability distributions for all 5 fruit classes.
- **Nutritional & Fun Fact Insights**: Displays calorie counts, key micronutrients, and interesting botanical trivia for every classified fruit.
- **Robust Error Handling**: Gracefully rejects non-image or corrupt files with user-friendly toast notifications.
- **RESTful API**: Includes `/predict` and `/health` endpoints for easy integration with third-party apps or mobile clients.
- **Ready for GitHub & Cloud Deployment**: Preconfigured with `Dockerfile`, `Procfile`, `requirements.txt`, and `.gitignore`.

---

## 🧠 Model Specifications

| Parameter | Specification |
| :--- | :--- |
| **Base Architecture** | MobileNetV2 (Pre-trained on ImageNet) |
| **Input Resolution** | `160 x 160 x 3` (RGB) |
| **Normalization** | `(image / 127.5) - 1.0` |
| **Output Classes** | 5 (`Apple`, `Banana`, `Grape`, `Mango`, `Strawberry`) |
| **Model Format** | `fruit_classifier_mobilenetv2.keras` (Keras 3 / TensorFlow) |
| **Test Accuracy** | **91%** |

---

## 📁 Project Structure

```
Fruit-Classification-Model/
├── app.py                             # Flask backend & prediction API
├── class_names.json                   # Class mapping JSON ['Apple', 'Banana', 'Grape', 'Mango', 'Strawberry']
├── fruit_classifier_mobilenetv2.keras # Pre-trained MobileNetV2 model
├── requirements.txt                   # Production Python dependencies
├── Procfile                           # Web process configuration for Render/Heroku
├── Dockerfile                         # Container configuration for Docker/Hugging Face
├── .dockerignore                      # Docker exclusion rules
├── .gitignore                         # Git exclusion rules (ignores raw dataset)
├── README.md                          # Comprehensive documentation
├── templates/
│   └── index.html                     # Semantic HTML5 single-page application
└── static/
    ├── css/
    │   └── style.css                  # Modern glassmorphism UI & responsive styles
    ├── js/
    │   └── main.js                    # AJAX requests, drag-drop, preview & chart logic
    └── samples/                       # Lightweight test images for 1-click evaluation
        ├── apple.jpg
        ├── banana.jpg
        ├── grape.jpg
        ├── mango.jpg
        └── strawberry.jpg
```

---

## 🚀 Quick Start (Local Setup)

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/Fruit-Classification-Model.git
cd Fruit-Classification-Model
```

### 2. Create and Activate a Virtual Environment

**On Windows (PowerShell):**
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

**On macOS / Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
python app.py
```

Open your browser and navigate to:
```
http://127.0.0.1:5000
```

---

## 🐳 Running with Docker

You can build and run the application locally inside a container:

```bash
# 1. Build the Docker image
docker build -t fruit-classifier .

# 2. Run the Docker container
docker run -p 10000:10000 fruit-classifier
```

Then visit `http://localhost:10000` in your web browser.

---

## ☁️ Deployment Guides

### Deploy to Render (Recommended - Free Tier)

1. Push your code to a GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Deploy Fruit Classifier Web App"
   git remote add origin https://github.com/YOUR_USERNAME/fruit-classifier.git
   git push -u origin main
   ```
2. Go to [Render.com](https://render.com) and click **New > Web Service**.
3. Connect your GitHub repository.
4. Configure the service:
   - **Environment**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT --workers 1 --threads 4 --worker-class gthread --timeout 120 --access-logfile - --error-logfile - app:app`
5. Click **Create Web Service**. Your app will be live with an HTTPS URL in minutes!

---

### Deploy to Hugging Face Spaces

1. Create a new Space on [Hugging Face](https://huggingface.co/spaces) with **Docker** SDK.
2. Push this repository to your Space:
   ```bash
   git remote add space https://huggingface.co/spaces/YOUR_USERNAME/fruit-classifier
   git push space main
   ```
3. The Space will automatically build the `Dockerfile` and start serving your web application.

---

## 🔌 API Reference

### 1. Predict Fruit
- **Endpoint**: `POST /predict`
- **Content-Type**: `multipart/form-data` or `application/json`

#### Request (Multipart Form):
```bash
curl -X POST -F "file=@apple.jpg" http://127.0.0.1:5000/predict
```

#### Example Response:
```json
{
  "success": true,
  "predicted_fruit": "Apple",
  "confidence": "98.42%",
  "confidence_score": 0.9842,
  "emoji": "🍎",
  "probabilities": [
    { "fruit": "Apple", "emoji": "🍎", "percentage": "98.42%", "probability": 0.9842, "score": 98.42 },
    { "fruit": "Strawberry", "emoji": "🍓", "percentage": "1.20%", "probability": 0.012, "score": 1.2 },
    { "fruit": "Mango", "emoji": "🥭", "percentage": "0.25%", "probability": 0.0025, "score": 0.25 },
    { "fruit": "Banana", "emoji": "🍌", "percentage": "0.10%", "probability": 0.001, "score": 0.1 },
    { "fruit": "Grape", "emoji": "🍇", "percentage": "0.03%", "probability": 0.0003, "score": 0.03 }
  ],
  "fruit_info": {
    "calories": "52 kcal / 100g",
    "key_nutrients": "Dietary Fiber, Vitamin C, Potassium",
    "fun_fact": "Apples float in water because 25% of their volume is actually air!",
    "health_benefit": "Promotes heart health, aids digestion, and helps regulate blood sugar."
  }
}
```

### 2. Health Check
- **Endpoint**: `GET /health`
```bash
curl http://127.0.0.1:5000/health
```

#### Example Response:
```json
{
  "status": "healthy",
  "model": "MobileNetV2 Fruit Classifier",
  "classes": ["Apple", "Banana", "Grape", "Mango", "Strawberry"],
  "test_accuracy": "91%",
  "input_resolution": "160x160"
}
```

---

## 🛠️ Tech Stack

- **Deep Learning**: TensorFlow, Keras 3, MobileNetV2 Transfer Learning
- **Backend**: Flask 3, Flask-CORS, Gunicorn, Waitress, Pillow, NumPy
- **Frontend**: HTML5, Vanilla CSS3 (Custom Glassmorphism Design System), JavaScript (ES6+)
- **Containerization**: Docker

---

## 📄 License

This project is licensed under the MIT License.

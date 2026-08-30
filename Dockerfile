FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=10000 \
    KERAS_BACKEND=tensorflow \
    CUDA_VISIBLE_DEVICES=-1 \
    TF_CPP_MIN_LOG_LEVEL=2 \
    TF_ENABLE_ONEDNN_OPTS=0

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files and trained model
COPY class_names.json .
COPY fruit_classifier_mobilenetv2.keras .
COPY app.py .
COPY templates/ templates/
COPY static/ static/

# Expose port
EXPOSE 10000

# Run with Gunicorn production WSGI server (single worker + multi-threading for CPU deployment)
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT:-10000} --workers 1 --threads 4 --worker-class gthread --timeout 120 --access-logfile - --error-logfile - app:app"]

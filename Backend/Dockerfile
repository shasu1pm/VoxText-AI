FROM python:3.11-slim

# Prevent Python from writing pyc files & enable logs immediately
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (ffmpeg required for yt-dlp audio extraction)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY server.py .

# Expose Flask port
EXPOSE 5000

# Start with Gunicorn for production (4 workers, adjust based on CPU cores)
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "server:app"]

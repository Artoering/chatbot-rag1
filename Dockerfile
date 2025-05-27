FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create necessary directories
RUN mkdir -p /app/chroma_db /app/app/uploads

# Set default port
ENV PORT=8000

# Expose the port
EXPOSE $PORT

# Command to run the application
CMD ["uvicorn", "main:app", "--port", "8000"]
CMD ["uvicorn", "main:app","--port", "8000"]

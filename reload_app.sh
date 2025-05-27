#!/bin/zsh

# Kill any process running on port 8000
lsof -ti:8000 | xargs kill -9 2>/dev/null

# Start the FastAPI app
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

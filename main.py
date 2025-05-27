import os
import sys
from fastapi import FastAPI
from dotenv import load_dotenv

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables from .env file
load_dotenv()

try:
    from app.api import app as api_app
    app = api_app
except ImportError as e:
    print(f"Error importing app.api: {e}")
    print(f"Current PYTHONPATH: {sys.path}")
    raise

# Add health check endpoint
# @app.get("/health")
# async def health_check():
#     return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    # Print all registered routes for debugging
    print("Registered routes:")
    for route in app.routes:
        print(f"{route.path} [{','.join(route.methods)}]")
    uvicorn.run(app, port=8000)

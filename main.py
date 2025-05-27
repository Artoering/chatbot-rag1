from fastapi import FastAPI
from app.api import app as api_app
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Create FastAPI app instance
app = api_app

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

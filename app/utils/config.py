import os
from dotenv import load_dotenv
from app.utils.exceptions import ConfigError

def load_openai_config():
    """Load OpenAI configuration from environment variables."""
    load_dotenv()  # Load environment variables from .env file
    
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ConfigError("OPENAI_API_KEY not found in environment variables")
    
    return {
        'api_key': api_key,
        'model': os.getenv('OPENAI_MODEL', 'gpt-3.5-turbo'),
        'temperature': float(os.getenv('OPENAI_TEMPERATURE', '0.7')),
        'max_tokens': int(os.getenv('OPENAI_MAX_TOKENS', '2000'))
    }

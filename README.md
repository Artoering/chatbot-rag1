# Multi-Tenant Chatbot with RAG

## Quick Access
- Frontend: https://chatbot-rag1.vercel.app
- Backend API: https://chatbot-rag1-production.up.railway.app/api

### Available Tenants
1. Fieldmate (tenant1)
   - Knowledge base: Fieldmate Manual
   - Use case: Technical support and documentation

2. SEO Service (tenant2)
   - Knowledge base: SEO documentation
   - Use case: SEO consulting and guidance

### Testing the API
Test the API with this curl command:
```bash
curl "https://chatbot-rag1-production.up.railway.app/api/tenant1/chat?query=What%20is%20Fieldmate?"
```

A multi-tenant chatbot application that uses Retrieval-Augmented Generation (RAG) to provide accurate, context-aware responses based on tenant-specific knowledge bases.

## Features

- Multi-tenant support with isolated knowledge bases
- PDF document ingestion
- Web page content ingestion
- Real-time chat interface
- Source attribution for responses
- Modern WhatsApp-style UI

## Tech Stack

### Backend
- FastAPI
- LangChain
- ChromaDB
- OpenAI
- Python 3.11+

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- DaisyUI

## Documentation

- [API Documentation](docs/API.md) - Detailed API endpoints and usage
- [Frontend Setup](frontend/README.md) - Frontend setup and configuration

## Getting Started

1. Clone the repository
2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   cd frontend && npm install
   ```
4. Run the backend:
   ```bash
   uvicorn main:app --reload
   ```
5. Run the frontend:
   ```bash
   cd frontend && npm run dev
   ```

## Deployment

- Backend: Deployed on Railway.app
- Frontend: Deploy on Vercel

## Project Structure

```
.
├── app/                    # Backend application code
│   ├── api/               # API endpoints
│   ├── ingestion/         # Document ingestion logic
│   ├── rag/              # RAG implementation
│   ├── tenants/          # Tenant configurations
│   └── utils/            # Utility functions
├── frontend/             # Next.js frontend
└── docs/                # Documentation
```

## License

MIT

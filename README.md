---
title: Multi-Tenant ChatBot RAG
emoji: 🤖
colorFrom: blue
colorTo: purple
sdk: docker
pinned: false
---

# Multi-Tenant ChatBot RAG System

This is a multi-tenant chatbot system that uses Retrieval Augmented Generation (RAG) to provide context-aware responses based on tenant-specific knowledge bases.

## Features

- Multi-tenant support
- PDF document ingestion
- Web page ingestion
- RAG-powered responses using ChromaDB and OpenAI
- Modern React frontend with Next.js
- FastAPI backend

## Tech Stack

- **Backend**: FastAPI, LangChain, ChromaDB
- **Frontend**: Next.js, TypeScript, TailwindCSS
- **Infrastructure**: Docker, Hugging Face Spaces

## API Endpoints

- Upload knowledge PDF (POST /api/{tenant_id}/knowledge/pdf)
- Add knowledge from website (POST /api/{tenant_id}/knowledge/web)
- Delete PDF knowledge (DELETE /api/{tenant_id}/knowledge/pdf)
- Update assistant instruction (PATCH /api/{tenant_id}/instruction)

## Development

### Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd frontend
yarn install
yarn dev
```

## Environment Variables

Make sure to set up these environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key

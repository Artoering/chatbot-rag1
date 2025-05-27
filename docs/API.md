# ChatBot RAG API Documentation

## Base URL
```
https://your-railway-deployment-url.railway.app/api
```

## Authentication
Currently, the API doesn't require authentication as it uses tenant-based routing.

## Accessing the Deployed Application

### Backend API
- Base URL: `https://chatbot-rag1-production.up.railway.app/api`
- Test the deployment by accessing: `https://chatbot-rag1-production.up.railway.app/api/tenant1/chat?query=hello`

### Frontend Application
- Frontend URL: `https://chatbot-rag1.vercel.app`
- Features available:
  1. Select tenant (Fieldmate or SEO Service)
  2. Chat with the AI using the knowledge base
  3. Upload new documents or add web sources
  4. View source references for answers

### Quick Start
1. Open `https://chatbot-rag1.vercel.app` in your browser
2. Select a tenant from the dropdown (e.g., "Fieldmate")
3. Start chatting or manage knowledge base using the tabs

## Endpoints

### Chat Endpoint
Send queries to the chatbot and receive AI-generated responses.

```http
GET /api/{tenant_id}/chat
```

#### Parameters
- `tenant_id` (path parameter, string): The ID of the tenant making the request
- `query` (query parameter, string): The user's question or message

#### Example Request
```http
GET /api/tenant1/chat?query=What is Fieldmate?
```

#### Example Response
```json
{
  "answer": "Fieldmate is...",
  "timestamp": "2024-05-22T10:30:00Z",
  "sources": [
    "FIELDMATE MANUAL.pdf"
  ]
}
```

### Knowledge Base Management

#### Upload PDF Document
Upload a PDF document to a tenant's knowledge base.

```http
POST /api/{tenant_id}/knowledge/pdf
```

**Content-Type**: `multipart/form-data`

#### Parameters
- `tenant_id` (path parameter, string): The ID of the tenant
- `file` (form data, file): PDF file to upload

#### Example using cURL
```bash
curl -X POST "https://your-api-url/api/tenant1/knowledge/pdf" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@document.pdf"
```

#### Add Web Source
Add a web page to the knowledge base.

```http
POST /api/{tenant_id}/knowledge/web
```

**Content-Type**: `multipart/form-data`

#### Parameters
- `tenant_id` (path parameter, string): The ID of the tenant
- `url` (form data, string): URL of the web page to add

#### Example using cURL
```bash
curl -X POST "https://your-api-url/api/tenant1/knowledge/web" \
  -F "url=https://example.com/page"
```

#### Delete PDF Document
Remove a PDF document from the knowledge base.

```http
DELETE /api/{tenant_id}/knowledge/pdf/{filename}
```

#### Parameters
- `tenant_id` (path parameter, string): The ID of the tenant
- `filename` (path parameter, string): Name of the PDF file to delete

#### Example using cURL
```bash
curl -X DELETE "https://your-api-url/api/tenant1/knowledge/pdf/document.pdf"
```

## Error Responses

The API returns standard HTTP status codes and JSON error messages:

```json
{
  "detail": "Error message description"
}
```

Common error codes:
- `400 Bad Request`: Invalid input or parameters
- `404 Not Found`: Resource not found
- `415 Unsupported Media Type`: Invalid file type
- `500 Internal Server Error`: Server-side error

## Environment Variables

The API requires the following environment variables:
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Port number for the server (default: 8000)

## Deployment

The API is containerized using Docker and can be deployed using the provided Dockerfile. Current deployment is on Railway.app.

## Technologies Used

- FastAPI: Web framework
- LangChain: RAG implementation
- ChromaDB: Vector database
- OpenAI: Language model
- Python 3.11+

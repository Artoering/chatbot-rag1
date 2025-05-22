from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Request
from fastapi.responses import JSONResponse
from app.utils import load_tenant_config
from app.ingestion import ingest_pdf_to_chroma, ingest_web_to_chroma
from app.rag import get_rag_response
from app.utils.exceptions import (
    TenantError,
    TenantNotFoundError,
    KnowledgeBaseError,
    VectorStoreError,
    DocumentProcessingError,
    RAGError,
    ContextRetrievalError,
    ResponseGenerationError
)
import os
import shutil
import json
from typing import Optional, List
from datetime import datetime

# Constants
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "../uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

# Custom exception handler
@app.exception_handler(TenantError)
async def tenant_exception_handler(request: Request, exc: TenantError):
    return JSONResponse(
        status_code=404,
        content={"error": "Tenant Error", "detail": str(exc)}
    )

@app.exception_handler(KnowledgeBaseError)
async def knowledge_base_exception_handler(request: Request, exc: KnowledgeBaseError):
    return JSONResponse(
        status_code=500,
        content={"error": "Knowledge Base Error", "detail": str(exc)}
    )

@app.exception_handler(RAGError)
async def rag_exception_handler(request: Request, exc: RAGError):
    return JSONResponse(
        status_code=500,
        content={"error": "RAG Pipeline Error", "detail": str(exc)}
    )

@app.get("/api/{tenant_id}/chat")
async def chat_entry(
    tenant_id: str, 
    query: str,
    conversation_id: Optional[str] = None
):
    """Enhanced chat endpoint with better error handling."""
    try:
        tenant_config = load_tenant_config(tenant_id)
        
        # Get chat history if conversation_id is provided
        chat_history = []  # TODO: Implement chat history storage
        
        response = get_rag_response(
            query=query,
            vector_namespace=tenant_config["vector_namespace"],
            assistant_instruction=tenant_config.get("assistant_instruction", ""),
            chat_history=chat_history
        )
        
        return {
            "tenant": tenant_config["name"],
            "query": query,
            "conversation_id": conversation_id,
            "timestamp": datetime.now().isoformat(),
            **response
        }
        
    except TenantNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except (VectorStoreError, ContextRetrievalError) as e:
        raise HTTPException(status_code=500, detail=f"Knowledge base error: {str(e)}")
    except ResponseGenerationError as e:
        raise HTTPException(status_code=500, detail=f"Response generation error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/api/{tenant_id}/knowledge/pdf")
async def upload_pdf_knowledge(tenant_id: str, file: UploadFile = File(...)):
    """Enhanced PDF upload endpoint with better error handling."""
    try:
        tenant_config = load_tenant_config(tenant_id)
        
        # Validate file type
        if not file.filename.lower().endswith('.pdf'):
            raise DocumentProcessingError("Only PDF files are accepted")
        
        # Create tenant directory and save file
        tenant_dir = os.path.join(UPLOAD_DIR, tenant_id)
        os.makedirs(tenant_dir, exist_ok=True)
        save_path = os.path.join(tenant_dir, file.filename)
        
        try:
            with open(save_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise DocumentProcessingError(f"Error saving file: {str(e)}")
        
        # Ingest to vector store with error handling
        try:
            n_chunks = ingest_pdf_to_chroma(save_path, tenant_config["vector_namespace"])
            
            return {
                "status": "success",
                "chunks": n_chunks,
                "file": file.filename,
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            # Clean up file if ingestion fails
            if os.path.exists(save_path):
                os.remove(save_path)
            raise DocumentProcessingError(f"Error ingesting PDF: {str(e)}")
            
    except TenantNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except DocumentProcessingError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@app.post("/api/{tenant_id}/knowledge/web")
def crawl_web_knowledge(tenant_id: str, url: str = Form(...)):
    """Crawl website dan simpan kontennya sebagai knowledge base."""
    try:
        tenant_config = load_tenant_config(tenant_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Tenant not found")
    n_chunks = ingest_web_to_chroma(url, tenant_config["vector_namespace"])
    return {"status": "success", "chunks": n_chunks, "url": url}

@app.delete("/api/{tenant_id}/knowledge/pdf/{filename}")
def delete_pdf_knowledge(tenant_id: str, filename: str):
    """Hapus file PDF dari knowledge base."""
    try:
        tenant_config = load_tenant_config(tenant_id)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="Tenant not found")
        
    tenant_dir = os.path.join(UPLOAD_DIR, tenant_id)
    file_path = os.path.join(tenant_dir, filename)
    
    if os.path.exists(file_path):
        os.remove(file_path)
        # TODO: Implement deletion from vector store
        return {"status": "deleted", "file": filename, "tenant": tenant_id}
    else:
        raise HTTPException(status_code=404, detail=f"File {filename} not found for tenant {tenant_id}")

@app.patch("/api/{tenant_id}/instruction")
def update_instruction(tenant_id: str, instruction: str = Form(...)):
    """Perbarui instruksi assistant per tenant."""
    config_path = os.path.join("app/tenants", f"{tenant_id}.json")
    if not os.path.exists(config_path):
        raise HTTPException(status_code=404, detail="Tenant not found")
    with open(config_path, "r") as f:
        config = json.load(f)
    config["assistant_instruction"] = instruction
    with open(config_path, "w") as f:
        json.dump(config, f, indent=2)
    return {"status": "updated", "instruction": instruction}

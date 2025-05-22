from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain
from langchain.prompts import SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatPromptTemplate
from langchain.docstore.document import Document
from typing import List, Dict, Any, Optional
from app.utils.exceptions import (
    ContextRetrievalError, 
    ResponseGenerationError, 
    VectorStoreError,
    RAGError,
    ConfigError
)
from app.utils.config import load_openai_config

def validate_documents(docs: List[Document]) -> bool:
    """Validate retrieved documents."""
    return bool(docs and all(doc.page_content.strip() for doc in docs))

def process_sources(docs: List[Document]) -> List[Dict[str, str]]:
    """Process source documents into a structured format."""
    sources = []
    for doc in docs:
        content = doc.page_content.strip()
        # Get a preview of the content (complete sentences if possible)
        if len(content) > 200:
            end_idx = content[:200].rfind('.')
            preview = content[:end_idx + 1] if end_idx > 0 else content[:200] + "..."
        else:
            preview = content
            
        source_info = {
            "content": preview,
            "metadata": doc.metadata if hasattr(doc, 'metadata') else {}
        }
        sources.append(source_info)
    return sources

def get_rag_response(
    query: str, 
    vector_namespace: str, 
    assistant_instruction: str, 
    chat_history: Optional[List[tuple]] = None,
    persist_dir: str = "chroma_db"
) -> Dict[str, Any]:
    """Get response using RAG (Retrieval Augmented Generation) with improved error handling."""
    try:
        # Load OpenAI configuration
        config = load_openai_config()
        
        # Initialize embeddings and vector store
        embeddings = OpenAIEmbeddings()
        vectordb = Chroma(
            collection_name=vector_namespace,
            embedding_function=embeddings,
            persist_directory=persist_dir
        )
        
        # Initialize the language model with config
        chat = ChatOpenAI(
            model=config['model'],
            temperature=config['temperature']
        )

        # Create the retrieval chain without custom prompts first
        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=chat,
            retriever=vectordb.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 3}
            ),
            return_source_documents=True,
            verbose=True
        )
        
        # Add the system instruction to the query
        enhanced_query = f"""
        Instructions for the assistant: {assistant_instruction}
        
        User query: {query}
        
        Please provide a clear and concise answer based on the provided context. 
        If the information is not available in the context, please state that honestly.
        """
        
        # Run the chain
        result = qa_chain({
            "question": enhanced_query,
            "chat_history": chat_history or []
        })
        
        # Validate and process results
        if not result.get("answer"):
            raise ResponseGenerationError("No answer generated")
            
        source_docs = result.get("source_documents", [])
        if not validate_documents(source_docs):
            raise ContextRetrievalError("No valid context found")
            
        return {
            "answer": result["answer"],
            "sources": [doc.page_content[:200] + "..." for doc in source_docs]
        }
        
    except VectorStoreError as e:
        raise RAGError(f"Vector store error: {str(e)}")
    except (ContextRetrievalError, ResponseGenerationError) as e:
        raise RAGError(str(e))
    except Exception as e:
        raise RAGError(f"Unexpected error in RAG pipeline: {str(e)}")

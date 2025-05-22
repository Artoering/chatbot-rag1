class ConfigError(Exception):
    """Raised when there's an error with configuration."""
    pass

class TenantError(Exception):
    """Base exception for tenant-related errors."""
    pass

class TenantNotFoundError(TenantError):
    """Raised when a tenant is not found."""
    pass

class KnowledgeBaseError(Exception):
    """Base exception for knowledge base related errors."""
    pass

class VectorStoreError(KnowledgeBaseError):
    """Raised when there's an error with the vector store."""
    pass

class DocumentProcessingError(KnowledgeBaseError):
    """Raised when there's an error processing a document."""
    pass

class RAGError(Exception):
    """Base exception for RAG-related errors."""
    pass

class ContextRetrievalError(RAGError):
    """Raised when there's an error retrieving context from the vector store."""
    pass

class ResponseGenerationError(RAGError):
    """Raised when there's an error generating a response."""
    pass

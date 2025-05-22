import os
from typing import List
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.document_loaders import PyPDFLoader
import requests
from bs4 import BeautifulSoup

def ingest_pdf_to_chroma(pdf_path: str, vector_namespace: str, persist_dir: str = "chroma_db"):
    """Ingest PDF file into Chroma vector store."""
    loader = PyPDFLoader(pdf_path)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents(documents)
    embeddings = OpenAIEmbeddings()
    vectordb = Chroma(
        collection_name=vector_namespace,
        embedding_function=embeddings,
        persist_directory=persist_dir
    )
    vectordb.add_documents(docs)
    vectordb.persist()
    return len(docs)

def ingest_web_to_chroma(url: str, vector_namespace: str, persist_dir: str = "chroma_db"):
    """Ingest crawled web page into Chroma vector store."""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    # Gabungkan semua text dari tag <p>
    text = "\n".join([p.get_text() for p in soup.find_all("p")])
    # Buat dokumen LangChain
    from langchain.schema import Document
    doc = Document(page_content=text, metadata={"source": url})
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    docs = text_splitter.split_documents([doc])
    embeddings = OpenAIEmbeddings()
    vectordb = Chroma(
        collection_name=vector_namespace,
        embedding_function=embeddings,
        persist_directory=persist_dir
    )
    vectordb.add_documents(docs)
    vectordb.persist()
    return len(docs)

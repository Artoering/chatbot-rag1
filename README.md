Upload knowledge PDF (POST /api/{tenant_id}/knowledge/pdf)
Tambah knowledge dari website (POST /api/{tenant_id}/knowledge/web)
Hapus knowledge PDF (DELETE /api/{tenant_id}/knowledge/pdf)
Update assistant instruction (PATCH /api/{tenant_id}/instruction)


RUN Backend:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

RUN Frontend
staryarn run dev
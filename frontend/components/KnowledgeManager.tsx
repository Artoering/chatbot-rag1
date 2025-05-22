"use client";

import { useState } from "react";
import { FileUpload } from "./FileUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

type KnowledgeSource = {
  type: "pdf" | "web";
  name: string;
  timestamp: string;
};

type Props = {
  tenantId: string;
  onSourceAdded: () => void;
};

export function KnowledgeManager({ tenantId, onSourceAdded }: Props) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState<KnowledgeSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (file: File): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(`/api/${tenantId}/knowledge/pdf`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onSourceAdded();
      setSources((prev) => [
        ...prev,
        {
          type: "pdf",
          name: file.name,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading file");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebSourceAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("url", url.trim());

      await axios.post(`/api/${tenantId}/knowledge/web`, formData);

      onSourceAdded();
      setSources((prev) => [
        ...prev,
        {
          type: "web",
          name: url.trim(),
          timestamp: new Date().toISOString(),
        },
      ]);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding web source");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (sourceType: "pdf" | "web", name: string) => {
    try {
      setError(null);
      if (sourceType === "pdf") {
        await axios.delete(
          `/api/${tenantId}/knowledge/pdf/${encodeURIComponent(name)}`
        );
      }
      setSources((prev) =>
        prev.filter((s) => !(s.type === sourceType && s.name === name))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting source");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">PDF Documents</h3>
            <FileUpload onFileUpload={handleFileUpload} accept=".pdf" />
          </div>
        </div>

        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">Web Sources</h3>
            <form onSubmit={handleWebSourceAdd} className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL"
                className="input input-bordered flex-1"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading || !url.trim()}
              >
                <FontAwesomeIcon icon={faGlobe} className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {sources.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-4">Knowledge Sources</h3>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name</th>
                  <th>Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={`${source.type}-${source.name}`}>
                    <td>{source.type === "pdf" ? "PDF" : "Web"}</td>
                    <td className="max-w-xs truncate">{source.name}</td>
                    <td>{new Date(source.timestamp).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDelete(source.type, source.name)}
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

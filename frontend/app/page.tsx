"use client";

import { useState } from "react";
import { TenantSelector } from "../components/TenantSelector";
import { ChatInterface } from "../components/ChatInterface";
import { KnowledgeManager } from "../components/KnowledgeManager";

type Tenant = {
  id: string;
  name: string;
  description: string;
};

// Mock tenants data - replace with actual API call
const tenants: Tenant[] = [
  {
    id: "tenant1",
    name: "Fieldmate",
    description: "Fieldmate Manual Assistant",
  },
  {
    id: "tenant2",
    name: "SEO Service",
    description: "SEO Knowledge Assistant",
  },
];

export default function Home() {
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "knowledge">("chat");

  return (
    <main className="container mx-auto max-w-5xl p-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="w-full max-w-xs">
            <TenantSelector
              tenants={tenants}
              selectedTenant={selectedTenant}
              onTenantSelect={setSelectedTenant}
            />
          </div>
          <h1 className="text-2xl font-bold">Multi-Tenant Chatbot</h1>
        </div>

        {selectedTenant && (
          <div className="tabs tabs-boxed w-fit">
            <button
              className={`tab ${activeTab === "chat" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("chat")}
            >
              Chat
            </button>
            <button
              className={`tab ${activeTab === "knowledge" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("knowledge")}
            >
              Knowledge Base
            </button>
          </div>
        )}

        <div className="rounded-lg border bg-base-100 p-4">
          {selectedTenant ? (
            activeTab === "chat" ? (
              <ChatInterface tenantId={selectedTenant.id} />
            ) : (
              <KnowledgeManager
                tenantId={selectedTenant.id}
                onSourceAdded={() => {
                  // Optionally refresh knowledge base or show notification
                }}
              />
            )
          ) : (
            <div className="py-12 text-center text-base-content/70">
              Please select a tenant to begin
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

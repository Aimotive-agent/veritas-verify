"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: "read" | "write" | "full";
  status: "active" | "revoked";
  createdAt: string;
  lastUsed?: string;
}

const initialKeys: ApiKey[] = [
  { id: "k1", name: "Radiology Dept Terminal", key: "vv_sk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6", permissions: "read", status: "active", createdAt: "2026-07-15T09:00:00Z", lastUsed: "2026-08-03T08:30:00Z" },
  { id: "k2", name: "Pharmacy Inventory System", key: "vv_sk_z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5", permissions: "write", status: "active", createdAt: "2026-06-20T14:00:00Z", lastUsed: "2026-08-02T16:00:00Z" },
  { id: "k3", name: "Old Finance API", key: "vv_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", permissions: "read", status: "revoked", createdAt: "2026-05-01T10:00:00Z", lastUsed: undefined },
];

export default function AdminSettingsPage() {
  const { t } = useLanguage();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(initialKeys);
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyPerm, setNewKeyPerm] = useState<"read" | "write" | "full">("read");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showNewKey, setShowNewKey] = useState(false);

  const generateKey = () => {
    if (!newKeyName.trim()) return;
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = "vv_sk_";
    for (let i = 0; i < 32; i++) key += chars[Math.floor(Math.random() * chars.length)];

    setApiKeys((prev) => [
      {
        id: `k${Date.now()}`,
        name: newKeyName.trim(),
        key,
        permissions: newKeyPerm,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setGeneratedKey(key);
    setNewKeyName("");
    setShowNewKey(false);
  };

  const revokeKey = (id: string) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k))
    );
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }).catch(() => {});
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl font-semibold text-ink mb-1">{t("admin.title")}</h2>
        <p className="text-sm text-muted">{t("admin.subtitle")}</p>
      </div>

      <div className="card p-6">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h3 className="font-serif font-semibold text-lg">{t("admin.apiKeys")}</h3>
            <p className="text-xs text-muted mt-1">{t("admin.apiKeysDesc")}</p>
          </div>
          <button
            onClick={() => { setShowNewKey(true); setGeneratedKey(null); }}
            className="btn-primary text-sm px-5 py-2.5"
          >
            {t("admin.generateKey")}
          </button>
        </div>

        {generatedKey && (
          <div className="mb-6 p-4 bg-emerald-bg rounded-sm border border-emerald/20">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-emerald" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-emerald">{t("admin.keyWarning")}</p>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 bg-white rounded-sm px-3 py-2 text-sm font-mono text-slate break-all border border-line">
                {generatedKey}
              </code>
              <button
                onClick={() => copyKey(generatedKey)}
                className="btn-secondary text-xs px-3 py-2 flex-shrink-0"
              >
                {copiedKey === generatedKey ? t("admin.keyCopied") : t("admin.copyKey")}
              </button>
            </div>
          </div>
        )}

        {showNewKey && (
          <div className="mb-6 p-4 bg-paper-2 rounded-sm space-y-4">
            <h4 className="font-serif font-semibold text-sm">{t("admin.generateKey")}</h4>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">{t("admin.keyName")}</label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder={t("admin.keyNamePlaceholder")}
                className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">{t("admin.keyPermissions")}</label>
              <div className="flex gap-2">
                {(["read", "write", "full"] as const).map((perm) => (
                  <button
                    key={perm}
                    onClick={() => setNewKeyPerm(perm)}
                    className={`text-xs px-3 py-1.5 rounded-sm font-medium transition-colors ${
                      newKeyPerm === perm
                        ? "bg-navy text-paper"
                        : "bg-line text-muted hover:bg-line-soft"
                    }`}
                  >
                    {t(`perm.${perm}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={generateKey} disabled={!newKeyName.trim()} className="btn-primary text-sm px-5 py-2.5 disabled:opacity-50">
                {t("general.create")}
              </button>
              <button onClick={() => setShowNewKey(false)} className="btn-secondary text-sm px-5 py-2.5">
                {t("general.cancel")}
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          {apiKeys.length === 0 ? (
            <p className="text-muted text-sm py-8 text-center">{t("admin.noKeys")}</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("admin.keyName")}</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("general.apiKey")}</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("admin.keyPermissions")}</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("admin.keyStatus")}</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("admin.keyCreated")}</th>
                  <th className="text-left py-2 pr-4 font-medium text-muted text-xs uppercase">{t("admin.keyLastUsed")}</th>
                  <th className="text-right py-2 font-medium text-muted text-xs uppercase">{t("general.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b border-line-soft last:border-0">
                    <td className="py-2.5 pr-4 font-medium text-ink">{key.name}</td>
                    <td className="py-2.5 pr-4">
                      <code className="text-[11px] text-muted bg-paper-2 rounded-sm px-2 py-0.5 font-mono">
                        {key.key.slice(0, 8)}...{key.key.slice(-4)}
                      </code>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-sm ${
                        key.permissions === "full" ? "bg-navy text-paper" :
                        key.permissions === "write" ? "bg-blue-bg text-blue" :
                        "bg-line text-muted"
                      }`}>
                        {t(`perm.${key.permissions}`)}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4">
                      <span className={`flex items-center gap-1.5 text-xs ${
                        key.status === "active" ? "text-emerald" : "text-muted"
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${key.status === "active" ? "bg-emerald" : "bg-line"}`} />
                        {key.status === "active" ? t("admin.keyActive") : t("admin.keyRevoked")}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 pr-4 text-xs text-muted">
                      {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {key.status === "active" && (
                          <button
                            onClick={() => copyKey(key.key)}
                            className="text-xs text-navy font-medium hover:underline"
                          >
                            {copiedKey === key.key ? t("admin.keyCopied") : t("admin.copyKey")}
                          </button>
                        )}
                        {key.status === "active" && (
                          <button
                            onClick={() => revokeKey(key.id)}
                            className="text-xs text-red font-medium hover:underline"
                          >
                            {t("admin.revokeKey")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-serif font-semibold text-lg mb-4">{t("admin.systemConfig")}</h3>
        <p className="text-xs text-muted mb-6">{t("admin.systemConfigDesc")}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Convex Backend URL</label>
              <input
                type="text"
                defaultValue="http://192.168.1.42:3210"
                className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">LINE Channel ID</label>
              <input
                type="text"
                defaultValue="@veritas-verify"
                className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">DBD API Endpoint</label>
              <input
                type="text"
                defaultValue="https://api.dbd.go.th/v2"
                className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white font-mono"
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">OCR Engine</label>
              <select className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white">
                <option>Tesseract + Custom Thai Model</option>
                <option>Google Cloud Vision</option>
                <option>Azure AI Document Intelligence</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">LLM Provider</label>
              <select className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white">
                <option>DeepSeek v4</option>
                <option>GPT-4o</option>
                <option>Claude 3.5 Sonnet</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">Default Language</label>
              <select className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white">
                <option>English</option>
                <option>Thai</option>
              </select>
            </div>
          </div>
        </div>
        <button className="btn-primary text-sm px-5 py-2.5 mt-6">{t("general.save")} Configuration</button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { users } from "@/lib/mockData";

const roleStyles = {
  admin: "bg-navy text-paper",
  officer: "bg-blue-bg text-blue",
  reviewer: "bg-emerald-bg text-emerald",
  viewer: "bg-line text-muted",
};

export default function UsersPage() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    if (filter !== "all" && u.role !== filter) return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.agency.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-ink mb-1">{t("users.title")}</h2>
          <p className="text-sm text-muted">{t("users.subtitle")}</p>
        </div>
        <button className="btn-primary text-sm px-5 py-2.5">
          {t("users.addUser")}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <p className="metric-num text-2xl">{users.length}</p>
          <p className="text-xs text-muted mt-1">{t("users.totalUsers")}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="metric-num text-2xl text-navy">{users.filter((u) => u.role === "admin").length}</p>
          <p className="text-xs text-muted mt-1">{t("users.administrators")}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="metric-num text-2xl text-blue">{users.filter((u) => u.role === "officer").length}</p>
          <p className="text-xs text-muted mt-1">{t("users.officers")}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="metric-num text-2xl text-emerald">{users.filter((u) => u.role === "reviewer").length}</p>
          <p className="text-xs text-muted mt-1">{t("users.reviewers")}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {(["all", "admin", "officer", "reviewer", "viewer"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`text-xs font-medium px-3 py-1.5 rounded-sm transition-colors ${
                filter === role
                  ? "bg-navy text-paper"
                  : "bg-line text-muted hover:bg-line-soft hover:text-slate"
              }`}
            >
              {role === "all" ? t("users.allRoles") : t(`users.role.${role}`)}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <svg className="absolute left-3 top-2.5 w-4 h-4 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("users.searchUsers")}
            className="w-full pl-9 pr-4 py-2 text-sm border border-line rounded-sm focus:border-navy transition-colors bg-white"
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-2">
                <th className="text-left py-3 px-5 font-medium text-muted text-xs uppercase tracking-wider">{t("users.user")}</th>
                <th className="text-left py-3 px-5 font-medium text-muted text-xs uppercase tracking-wider">{t("users.role")}</th>
                <th className="text-left py-3 px-5 font-medium text-muted text-xs uppercase tracking-wider">{t("users.agency")}</th>
                <th className="text-left py-3 px-5 font-medium text-muted text-xs uppercase tracking-wider">{t("users.line")}</th>
                <th className="text-left py-3 px-5 font-medium text-muted text-xs uppercase tracking-wider">{t("users.lastActive")}</th>
                <th className="text-right py-3 px-5 font-medium text-muted text-xs uppercase tracking-wider">{t("users.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-line-soft last:border-0 hover:bg-paper-2/50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy text-xs font-bold">
                        {user.name.slice(0, 2)}
                      </div>
                      <span className="font-medium text-ink">{user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-sm ${roleStyles[user.role]}`}>
                      {t(`users.role.${user.role}`)}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-muted">{user.agency}</td>
                  <td className="py-3 px-5">
                    {user.lineId ? (
                      <span className="flex items-center gap-1.5 text-emerald text-xs">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald" />
                        {t("users.lineConnected")}
                      </span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-muted text-xs">
                    {new Date(user.lastActive).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-5 text-right">
                    <button className="text-xs text-navy font-medium hover:underline mr-3">{t("users.edit")}</button>
                    <button className="text-xs text-muted hover:text-red transition-colors">{t("users.remove")}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted text-sm">{t("users.noUsers")}</p>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h3 className="font-serif font-semibold text-lg mb-4">{t("users.rolePermissions")}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { role: t("users.role.admin"), perms: ["Manage users & roles", "Create/edit projects", "Configure pipelines", "View all reports"] },
            { role: t("users.role.officer"), perms: ["Upload documents", "Create projects", "View own reports", "Start verification"] },
            { role: t("users.role.reviewer"), perms: ["Review flagged docs", "Approve/reject results", "Add review notes", "View pipeline status"] },
            { role: t("users.role.viewer"), perms: ["View projects", "Download reports", "Read knowledge base", "No modifications"] },
          ].map((group) => (
            <div key={group.role} className="p-4 bg-paper-2 rounded-sm">
              <h4 className="font-serif font-semibold text-ink text-sm mb-3">{group.role}</h4>
              <ul className="space-y-2">
                {group.perms.map((perm) => (
                  <li key={perm} className="flex items-start gap-2 text-xs text-slate">
                    <svg className="w-3.5 h-3.5 text-emerald flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-serif font-semibold text-lg mb-4">{t("users.lineIntegration")}</h3>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-sm bg-emerald-bg flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-ink">LINE Login & Notifications</p>
                <p className="text-xs text-muted">{t("users.lineAuthDesc")}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium bg-emerald-bg text-emerald px-2 py-0.5 rounded-sm uppercase">{t("general.connected")}</span>
              <span className="text-xs text-muted">Channel ID: @veritas-verify</span>
            </div>
          </div>
          <div className="flex-1 bg-paper-2 rounded-sm p-4">
            <h4 className="text-xs text-muted uppercase tracking-wider mb-3">{t("users.lineConnectedUsers")}</h4>
            <div className="space-y-2">
              {users.filter((u) => u.lineId).map((u) => (
                <div key={u.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate">{u.name}</span>
                  <span className="text-[11px] text-emerald font-mono">{u.lineId}</span>
                </div>
              ))}
              {users.filter((u) => u.lineId).length === 0 && (
                <p className="text-xs text-muted">{t("users.noLineUsers")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

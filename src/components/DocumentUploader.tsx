"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface DocumentUploaderProps {
  onUpload: (files: File[]) => void;
  acceptedTypes?: string;
  maxFiles?: number;
}

export default function DocumentUploader({ onUpload, acceptedTypes = ".pdf,.jpg,.jpeg,.png,.tiff", maxFiles = 10 }: DocumentUploaderProps) {
  const { t } = useLanguage();
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      const combined = [...files, ...dropped].slice(0, maxFiles);
      setFiles(combined);
      onUpload(combined);
    },
    [files, maxFiles, onUpload]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const combined = [...files, ...selected].slice(0, maxFiles);
      setFiles(combined);
      onUpload(combined);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onUpload(updated);
  };

  const formatSize = (size: number) => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
          dragging ? "border-navy bg-navy/5" : "border-line hover:border-muted"
        }`}
      >
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            <p className="text-sm text-slate">
              <span className="text-navy font-medium">{t("docs.clickUpload")}</span> {t("docs.dragDrop")}
            </p>
            <p className="text-xs text-muted mt-1">
              {t("docs.accepted")} ({t("docs.maxFiles").replace("{n}", String(maxFiles))})
            </p>
          </div>
          <input
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="btn-secondary text-sm px-4 py-2 cursor-pointer">
            {t("docs.selectFiles")}
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs text-muted uppercase tracking-wider">
            {t("docs.uploadedFiles")} ({files.length}/{maxFiles})
          </h4>
          {files.map((file, i) => (
            <div key={i} className="card p-3 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <svg className="w-5 h-5 flex-shrink-0 text-muted" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm text-ink truncate">{file.name}</p>
                  <p className="text-xs text-muted">{formatSize(file.size)}</p>
                </div>
              </div>
              <button
                onClick={() => removeFile(i)}
                className="p-1 text-muted hover:text-red transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

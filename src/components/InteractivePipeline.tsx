"use client";

import { useState, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PipelineFlow from "@/components/PipelineFlow";
import type { PipelineStep } from "@/lib/types";

interface InteractivePipelineProps {
  onComplete?: () => void;
}

export default function InteractivePipeline({ onComplete }: InteractivePipelineProps) {
  const { t } = useLanguage();
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const makeSteps = useCallback((): PipelineStep[] => [
    { id: "1", label: t("pipeline.step1"), description: t("pipeline.step1desc"), status: "pending" },
    { id: "2", label: t("pipeline.step2"), description: t("pipeline.step2desc"), status: "pending" },
    { id: "3", label: t("pipeline.step3"), description: t("pipeline.step3desc"), status: "pending" },
    { id: "4", label: t("pipeline.step4"), description: t("pipeline.step4desc"), status: "pending" },
    { id: "5", label: t("pipeline.step5"), description: t("pipeline.step5desc"), status: "pending" },
    { id: "6", label: t("pipeline.step6"), description: t("pipeline.step6desc"), status: "pending" },
  ], [t]);

  const [steps, setSteps] = useState<PipelineStep[]>(makeSteps());

  const addLog = useCallback((msg: string) => {
    setLogs((prev) => [...prev.slice(-19), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const advanceStep = useCallback((index: number) => {
    setSteps((prev) =>
      prev.map((s, i) => {
        if (i === index) return { ...s, status: "running" as const, progress: 0 };
        if (i < index) return { ...s, status: "completed" as const, progress: 100 };
        return s;
      })
    );
  }, []);

  const completeStep = useCallback((index: number) => {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, status: "completed" as const, progress: 100 } : s))
    );
  }, []);

  const startPipeline = () => {
    if (running) return;
    setRunning(true);
    setLogs([]);
    const fresh = makeSteps();
    setSteps(fresh);

    addLog("Pipeline initialized. Starting document upload...");
    advanceStep(0);

    const timings = [2000, 3000, 3500, 4000, 2500, 2000];
    const messages = [
      "Documents uploaded successfully (3 files: PDF, JPG, PDF).",
      "OCR engine started. Processing Thai text extraction with Tesseract + custom model...",
      "Field extraction running. Parsing names, dates, registration numbers...",
      "AI Verification initiated with DeepSeek v4. Cross-referencing against RAG knowledge base.",
      "Compliance scoring complete. Running final validation checks...",
      "Report compiled and saved. Ready for review.",
    ];

    let elapsed = 0;
    timings.forEach((delay, i) => {
      elapsed += delay;
      const stepIndex = i;
      setTimeout(() => {
        if (stepIndex > 0) completeStep(stepIndex - 1);
        advanceStep(stepIndex);
        addLog(messages[stepIndex]);

        if (stepIndex === timings.length - 1) {
          setTimeout(() => {
            completeStep(timings.length - 1);
            addLog("All pipeline steps completed successfully. 3 documents verified, 0 flagged.");
            setRunning(false);
            onComplete?.();
          }, delay);
        }
      }, elapsed);
    });
  };

  const resetPipeline = () => {
    setRunning(false);
    setSteps(makeSteps());
    setLogs([]);
  };

  const allComplete = steps.every((s) => s.status === "completed");
  const hasResults = steps.some((s) => s.status === "completed");

  const pipelineComponents = [
    { label: t("pipeline.component1"), desc: t("pipeline.component1desc"), status: t("general.active") },
    { label: t("pipeline.component2"), desc: t("pipeline.component2desc"), status: t("general.online") },
    { label: t("pipeline.component3"), desc: t("pipeline.component3desc"), status: t("general.online") },
    { label: t("pipeline.component4"), desc: t("pipeline.component4desc"), status: t("general.connected") },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif font-semibold text-lg">{t("pipeline.title")}</h3>
          <p className="text-xs text-muted">{t("pipeline.subtitle")}</p>
        </div>
        <div className="flex gap-2">
          {!running && !allComplete && (
            <button onClick={startPipeline} className="btn-primary text-sm px-5 py-2.5 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t("pipeline.start")}
            </button>
          )}
          {running && (
            <button disabled className="btn-primary text-sm px-5 py-2.5 opacity-50 cursor-not-allowed flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {t("pipeline.processing")}
            </button>
          )}
          {(allComplete || hasResults) && (
            <button onClick={resetPipeline} className="btn-secondary text-sm px-5 py-2.5">
              {t("pipeline.runAgain")}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <PipelineFlow steps={steps} />
        </div>
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="font-serif font-semibold mb-3">{t("pipeline.log")}</h4>
            <div className="bg-paper-2 rounded-sm p-3 h-64 overflow-y-auto font-mono text-[11px] text-slate leading-relaxed">
              {logs.length === 0 ? (
                <p className="text-muted text-center pt-20">{t("pipeline.noActivity")}</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className="mb-1 last:mb-0">
                    {log}
                  </p>
                ))
              )}
              {running && (
                <div className="flex items-center gap-2 mt-1 text-navy">
                  <div className="w-1.5 h-1.5 rounded-full bg-navy animate-pulse" />
                  <span className="animate-pulse">...</span>
                </div>
              )}
            </div>
          </div>

          {hasResults && (
            <div className="card p-5">
              <h4 className="font-serif font-semibold mb-3">{t("pipeline.components")}</h4>
              <div className="space-y-2.5">
                {pipelineComponents.map((comp) => (
                  <div key={comp.label} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink">{comp.label}</p>
                        <span className="text-[10px] bg-emerald-bg text-emerald px-1.5 py-0.5 rounded-sm">{comp.status}</span>
                      </div>
                      <p className="text-xs text-muted">{comp.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

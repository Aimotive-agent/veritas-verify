import type { PipelineStep } from "@/lib/types";

interface PipelineFlowProps {
  steps: PipelineStep[];
}

const statusConfig = {
  pending: { bg: "bg-line", fg: "text-muted", anim: "" },
  running: { bg: "bg-blue-bg", fg: "text-blue", anim: "animate-pulse" },
  completed: { bg: "bg-emerald-bg", fg: "text-emerald", anim: "" },
  failed: { bg: "bg-red-bg", fg: "text-red", anim: "" },
};

const statusIcons = {
  pending: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  running: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  completed: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  failed: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
};

export default function PipelineFlow({ steps }: PipelineFlowProps) {
  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const config = statusConfig[step.status];
        const icon = statusIcons[step.status];
        return (
          <div key={step.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${config.fg} ${config.bg} border-current ${config.anim}`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                </svg>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 min-h-[28px] ${step.status === "completed" ? "bg-emerald/30" : "bg-line"}`} />
              )}
            </div>
            <div className="pb-6 flex-1">
              <h4 className={`text-sm font-medium ${config.fg}`}>{step.label}</h4>
              <p className="text-xs text-muted mt-0.5">{step.description}</p>
              {step.progress !== undefined && step.status === "running" && (
                <div className="mt-2 w-full bg-line rounded-full h-1.5">
                  <div
                    className="bg-blue h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${step.progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

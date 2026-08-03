"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState<"login" | "verify">("login");
  const [lineId, setLineId] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLineLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("verify");
    }, 1500);
  };

  const handleVerify = () => {
    if (!otp.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/");
    }, 1200);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-sm bg-navy flex items-center justify-center text-gold font-bold text-xl mx-auto mb-4">
            V
          </div>
          <h1 className="font-serif text-2xl font-semibold text-ink mb-1">{t("app.name")}</h1>
          <p className="text-sm text-muted">{t("app.subtitle")}</p>
        </div>

        <div className="card p-8">
          {step === "login" ? (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif font-semibold text-lg text-center mb-2">{t("login.signIn")}</h2>
                <p className="text-xs text-muted text-center">{t("login.subtitle")}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1.5">{t("login.lineIdLabel")}</label>
                  <input
                    type="text"
                    value={lineId}
                    onChange={(e) => setLineId(e.target.value)}
                    placeholder={t("login.lineIdPlaceholder")}
                    className="w-full px-4 py-2.5 text-sm border border-line rounded-sm focus:border-navy transition-colors"
                  />
                </div>

                <button
                  onClick={handleLineLogin}
                  disabled={!lineId.trim() || loading}
                  className="btn-primary w-full py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("login.connecting")}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                      </svg>
                      {t("login.lineButton")}
                    </>
                  )}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-line" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-muted">{t("login.orContinue")}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setLineId("demo@veritas-verify.go.th");
                    setTimeout(() => handleLineLogin(), 100);
                  }}
                  className="btn-secondary w-full py-2.5 text-sm font-medium"
                >
                  {t("login.demoAccess")}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="font-serif font-semibold text-lg text-center mb-2">{t("login.verifyTitle")}</h2>
                <p className="text-xs text-muted text-center">
                  {t("login.verifyDesc")}
                  <br />
                  <span className="text-navy">{lineId}</span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">{t("login.verificationCode")}</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6).replace(/\D/g, ""))}
                    onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full px-4 py-2.5 text-lg text-center font-mono tracking-[0.3em] border border-line rounded-sm focus:border-navy transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <button
                onClick={handleVerify}
                disabled={otp.length !== 6 || loading}
                className="btn-primary w-full py-2.5 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t("login.verifying")}
                  </>
                ) : (
                  t("login.verifyButton")
                )}
              </button>

              <button
                onClick={() => setStep("login")}
                className="w-full text-xs text-navy font-medium hover:underline text-center block"
              >
                {t("login.backToSignIn")}
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] text-muted text-center mt-6">
          {t("login.disclaimer")}
        </p>
      </div>
    </div>
  );
}

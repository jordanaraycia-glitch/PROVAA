"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">FinanceTrack</h1>
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="text-sm">Redirecionando...</span>
        </div>
      </div>
    </div>
  );
}

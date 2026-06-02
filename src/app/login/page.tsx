"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { Eye, EyeOff, Wallet, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const { user, loading: authLoading, login } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        router.replace("/dashboard");
      }
    }
  }, [user, authLoading, router]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.email) errs.email = "Email é obrigatório";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email inválido";
    if (!form.password) errs.password = "Senha é obrigatória";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      showToast("Login realizado com sucesso! 👋", "success");
      router.replace("/dashboard");
      return;
    }

    setErrors({ general: result.error || "Erro ao fazer login" });
    showToast(result.error || "Erro ao fazer login", "error");
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="w-20 h-20 bg-white/15 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/20">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-3">FinanceTrack</h1>
          <p className="text-lg text-white/80 mb-8">
            Entre e gerencie suas despesas sem complicação.
          </p>
          <div className="space-y-4 text-left">
            {[
              { icon: "✅", text: "Acesso rápido e seguro" },
              { icon: "📊", text: "Painel de despesas em tempo real" },
              { icon: "🔒", text: "Sessões protegidas por token JWT" },
              { icon: "📱", text: "Funciona em qualquer dispositivo" },
            ].map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-sm text-white/90">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">FinanceTrack</h1>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Já tem uma conta?</h2>
              <p className="text-slate-500 mt-1">Entre para acessar seu dashboard e gerenciar suas finanças.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {errors.general}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, email: e.target.value }));
                      setErrors((prev) => ({ ...prev, email: "", general: "" }));
                    }}
                    placeholder="seu@email.com"
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 text-sm transition-all outline-none ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, password: e.target.value }));
                      setErrors((prev) => ({ ...prev, password: "", general: "" }));
                    }}
                    placeholder="Sua senha"
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border text-slate-800 placeholder-slate-400 text-sm transition-all outline-none ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-200 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Entrando...
                  </span>
                ) : (
                  "Entrar"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Ainda não tem conta?{' '}
              <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-700">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

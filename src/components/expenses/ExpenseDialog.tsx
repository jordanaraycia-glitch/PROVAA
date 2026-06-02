"use client";

import React, { useState, useEffect } from "react";
import { Expense } from "@/types";
import { cn } from "@/lib/utils";
import { X, DollarSign, Calendar, Tag, CreditCard, FileText } from "lucide-react";

const CATEGORIES = [
  { value: "Alimentação", label: "🍔 Alimentação" },
  { value: "Transporte", label: "🚗 Transporte" },
  { value: "Saúde", label: "❤️ Saúde" },
  { value: "Educação", label: "📚 Educação" },
  { value: "Lazer", label: "🎉 Lazer" },
  { value: "Outros", label: "📦 Outros" },
];

const PAYMENT_METHODS = [
  { value: "Dinheiro", label: "💵 Dinheiro" },
  { value: "Débito", label: "💳 Débito" },
  { value: "Crédito", label: "💳 Crédito" },
  { value: "PIX", label: "⚡ PIX" },
  { value: "Outro", label: "🔄 Outro" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    description: string;
    amount: number;
    category: string;
    expenseDate: string;
    paymentMethod: string;
  }) => Promise<void>;
  expense?: Expense | null;
  loading?: boolean;
}

export default function ExpenseDialog({
  open,
  onClose,
  onSubmit,
  expense,
  loading = false,
}: Props) {
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "Alimentação",
    expenseDate: today,
    paymentMethod: "PIX",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (expense) {
      setForm({
        description: expense.description,
        amount: parseFloat(expense.amount).toString(),
        category: expense.category,
        expenseDate: expense.expenseDate,
        paymentMethod: expense.paymentMethod,
      });
    } else {
      setForm({
        description: "",
        amount: "",
        category: "Alimentação",
        expenseDate: today,
        paymentMethod: "PIX",
      });
    }
    setErrors({});
  }, [expense, open, today]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.description.trim()) errs.description = "Descrição é obrigatória";
    if (form.description.length > 255) errs.description = "Máximo 255 caracteres";
    if (!form.amount || isNaN(parseFloat(form.amount)))
      errs.amount = "Valor é obrigatório";
    if (parseFloat(form.amount) <= 0) errs.amount = "Valor deve ser maior que 0";
    if (!form.expenseDate) errs.expenseDate = "Data é obrigatória";
    if (form.expenseDate > today) errs.expenseDate = "Data não pode ser futura";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    await onSubmit({
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category,
      expenseDate: form.expenseDate,
      paymentMethod: form.paymentMethod,
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-slate-100 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {expense ? "Editar Despesa" : "Nova Despesa"}
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {expense
                  ? "Atualize os dados da despesa"
                  : "Registre um novo gasto"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <FileText className="inline w-4 h-4 mr-1 text-violet-500" />
              Descrição
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Ex: Supermercado, Conta de luz..."
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 text-sm transition-colors outline-none",
                errors.description
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <DollarSign className="inline w-4 h-4 mr-1 text-violet-500" />
              Valor (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
                R$
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: e.target.value }))
                }
                placeholder="0,00"
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-xl border text-slate-800 placeholder-slate-400 text-sm transition-colors outline-none",
                  errors.amount
                    ? "border-red-300 bg-red-50 focus:border-red-400"
                    : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
                )}
              />
            </div>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Category & Payment - 2 col */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <Tag className="inline w-4 h-4 mr-1 text-violet-500" />
                Categoria
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm((f) => ({ ...f, category: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:border-violet-400 focus:bg-white transition-colors outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <CreditCard className="inline w-4 h-4 mr-1 text-violet-500" />
                Pagamento
              </label>
              <select
                value={form.paymentMethod}
                onChange={(e) =>
                  setForm((f) => ({ ...f, paymentMethod: e.target.value }))
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:border-violet-400 focus:bg-white transition-colors outline-none"
              >
                {PAYMENT_METHODS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              <Calendar className="inline w-4 h-4 mr-1 text-violet-500" />
              Data
            </label>
            <input
              type="date"
              value={form.expenseDate}
              max={today}
              onChange={(e) =>
                setForm((f) => ({ ...f, expenseDate: e.target.value }))
              }
              className={cn(
                "w-full px-4 py-3 rounded-xl border text-slate-800 text-sm transition-colors outline-none",
                errors.expenseDate
                  ? "border-red-300 bg-red-50 focus:border-red-400"
                  : "border-slate-200 bg-slate-50 focus:border-violet-400 focus:bg-white"
              )}
            />
            {errors.expenseDate && (
              <p className="text-red-500 text-xs mt-1">{errors.expenseDate}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Salvando...
                </span>
              ) : expense ? (
                "Salvar Alterações"
              ) : (
                "Registrar Despesa"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

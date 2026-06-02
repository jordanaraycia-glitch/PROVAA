"use client";

import React from "react";
import { Expense } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Edit2, Trash2, Receipt } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  Alimentação: "🍔",
  Transporte: "🚗",
  Saúde: "❤️",
  Educação: "📚",
  Lazer: "🎉",
  Outros: "📦",
};

const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "bg-orange-100 text-orange-700",
  Transporte: "bg-blue-100 text-blue-700",
  Saúde: "bg-red-100 text-red-700",
  Educação: "bg-purple-100 text-purple-700",
  Lazer: "bg-pink-100 text-pink-700",
  Outros: "bg-slate-100 text-slate-700",
};

const PAYMENT_ICONS: Record<string, string> = {
  Dinheiro: "💵",
  Débito: "💳",
  Crédito: "💳",
  PIX: "⚡",
  Outro: "🔄",
};

interface Props {
  expenses: Expense[];
  loading?: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export default function ExpenseTable({
  expenses,
  loading,
  onEdit,
  onDelete,
}: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 border-b border-slate-50 animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded flex-1" />
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="h-4 bg-slate-200 rounded w-20" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Receipt className="w-8 h-8 text-slate-400" />
        </div>
        <p className="text-slate-500 font-medium">Nenhuma despesa encontrada</p>
        <p className="text-slate-400 text-sm mt-1">
          Adicione sua primeira despesa ou ajuste os filtros
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Descrição
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Categoria
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Pagamento
              </th>
              <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Data
              </th>
              <th className="text-right px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-5 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <td className="px-5 py-4">
                  <p className="text-sm font-medium text-slate-800 truncate max-w-[200px]">
                    {expense.description}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      CATEGORY_COLORS[expense.category]
                    }`}
                  >
                    {CATEGORY_ICONS[expense.category]}
                    {expense.category}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {PAYMENT_ICONS[expense.paymentMethod]}{" "}
                    {expense.paymentMethod}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-slate-600">
                    {formatDate(expense.expenseDate)}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(parseFloat(expense.amount))}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                      title="Editar"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(expense)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-slate-100">
        {expenses.map((expense) => (
          <div key={expense.id} className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {expense.description}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatDate(expense.expenseDate)} •{" "}
                  {PAYMENT_ICONS[expense.paymentMethod]} {expense.paymentMethod}
                </p>
              </div>
              <p className="text-base font-bold text-slate-800 ml-3">
                {formatCurrency(parseFloat(expense.amount))}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  CATEGORY_COLORS[expense.category]
                }`}
              >
                {CATEGORY_ICONS[expense.category]} {expense.category}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(expense)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(expense)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

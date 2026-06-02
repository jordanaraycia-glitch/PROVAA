"use client";

import React from "react";
import { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, string> = {
  Alimentação: "🍔",
  Transporte: "🚗",
  Saúde: "❤️",
  Educação: "📚",
  Lazer: "🎉",
  Outros: "📦",
};

const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "bg-orange-500",
  Transporte: "bg-blue-500",
  Saúde: "bg-red-500",
  Educação: "bg-purple-500",
  Lazer: "bg-pink-500",
  Outros: "bg-slate-400",
};

const CATEGORY_BG: Record<string, string> = {
  Alimentação: "bg-orange-50 border-orange-200",
  Transporte: "bg-blue-50 border-blue-200",
  Saúde: "bg-red-50 border-red-200",
  Educação: "bg-purple-50 border-purple-200",
  Lazer: "bg-pink-50 border-pink-200",
  Outros: "bg-slate-50 border-slate-200",
};

interface Props {
  expenses: Expense[];
  loading?: boolean;
}

export default function CategoryBreakdown({ expenses, loading }: Props) {
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + parseFloat(e.amount);
  });

  const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <div className="h-5 w-40 bg-slate-200 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 bg-slate-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-3 bg-slate-200 rounded mb-2 w-24" />
                <div className="h-2 bg-slate-200 rounded" />
              </div>
              <div className="h-4 w-16 bg-slate-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4 text-sm">Por Categoria</h3>
        <p className="text-slate-400 text-sm text-center py-4">
          Nenhum dado disponível
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <h3 className="font-bold text-slate-800 mb-4 text-sm">
        💰 Gastos por Categoria
      </h3>
      <div className="space-y-3">
        {sorted.map(([category, amount]) => {
          const pct = total > 0 ? (amount / total) * 100 : 0;
          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm border ${CATEGORY_BG[category]}`}
                  >
                    {CATEGORY_ICONS[category]}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-slate-800">
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1">
                    ({pct.toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${CATEGORY_COLORS[category]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

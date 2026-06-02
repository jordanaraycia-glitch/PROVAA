"use client";

import React from "react";
import { Expense } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, Calendar, Tag, Receipt } from "lucide-react";

const CATEGORY_ICONS: Record<string, string> = {
  Alimentação: "🍔",
  Transporte: "🚗",
  Saúde: "❤️",
  Educação: "📚",
  Lazer: "🎉",
  Outros: "📦",
};

interface Props {
  expenses: Expense[];
  loading?: boolean;
}

export default function SummaryCards({ expenses, loading }: Props) {
  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const now = new Date();
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.expenseDate + "T12:00:00");
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonth.reduce((sum, e) => sum + parseFloat(e.amount), 0);

  // Top category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount);
  });
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

  const cards = [
    {
      label: "Total Gasto",
      value: formatCurrency(total),
      icon: Receipt,
      color: "from-violet-500 to-purple-600",
      bg: "bg-violet-50",
      iconColor: "text-violet-600",
    },
    {
      label: "Este Mês",
      value: formatCurrency(thisMonthTotal),
      icon: Calendar,
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "Nº de Despesas",
      value: expenses.length.toString(),
      icon: TrendingUp,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Maior Categoria",
      value: topCategory
        ? `${CATEGORY_ICONS[topCategory[0]]} ${topCategory[0]}`
        : "—",
      icon: Tag,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm animate-pulse">
            <div className="h-4 bg-slate-200 rounded mb-3 w-20" />
            <div className="h-8 bg-slate-200 rounded w-28" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
        >
          <div className={`inline-flex p-2 rounded-xl ${card.bg} mb-3`}>
            <card.icon className={`w-5 h-5 ${card.iconColor}`} />
          </div>
          <p className="text-xs font-medium text-slate-500 mb-1">{card.label}</p>
          <p className="text-lg font-bold text-slate-800 truncate">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

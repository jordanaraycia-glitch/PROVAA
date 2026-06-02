"use client";

import React from "react";
import { Search, Filter, X } from "lucide-react";
import { ExpenseFilters } from "@/types";

const CATEGORIES = [
  { value: "all", label: "Todas as categorias" },
  { value: "Alimentação", label: "🍔 Alimentação" },
  { value: "Transporte", label: "🚗 Transporte" },
  { value: "Saúde", label: "❤️ Saúde" },
  { value: "Educação", label: "📚 Educação" },
  { value: "Lazer", label: "🎉 Lazer" },
  { value: "Outros", label: "📦 Outros" },
];

interface Props {
  filters: ExpenseFilters;
  onChange: (filters: ExpenseFilters) => void;
  onReset: () => void;
  onApply: () => void;
}

export default function ExpenseFiltersComponent({
  filters,
  onChange,
  onReset,
  onApply,
}: Props) {
  const hasFilters =
    filters.category !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.search;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-violet-600" />
        <h3 className="font-semibold text-slate-700 text-sm">Filtrar Despesas</h3>
        {hasFilters && (
          <button
            onClick={onReset}
            className="ml-auto text-xs text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" />
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar descrição..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && onApply()}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm focus:border-violet-400 focus:bg-white transition-colors outline-none"
          />
        </div>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:border-violet-400 focus:bg-white transition-colors outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Date From */}
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
          placeholder="De..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:border-violet-400 focus:bg-white transition-colors outline-none"
        />

        {/* Date To */}
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
          placeholder="Até..."
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm focus:border-violet-400 focus:bg-white transition-colors outline-none"
        />
      </div>

      <div className="mt-3 flex justify-end">
        <button
          onClick={onApply}
          className="px-6 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
}

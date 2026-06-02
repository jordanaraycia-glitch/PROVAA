"use client";

import { useState, useCallback } from "react";
import { Expense, ExpenseFilters } from "@/types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExpenses = useCallback(async (filters?: Partial<ExpenseFilters>) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.category && filters.category !== "all") {
        params.set("category", filters.category);
      }
      if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters?.dateTo) params.set("dateTo", filters.dateTo);
      if (filters?.search) params.set("search", filters.search);

      const res = await fetch(`/api/expenses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setExpenses(data.expenses);
      } else {
        setError("Erro ao carregar despesas");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  }, []);

  const createExpense = async (data: {
    description: string;
    amount: number;
    category: string;
    expenseDate: string;
    paymentMethod: string;
  }) => {
    const res = await fetch("/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) {
      return { success: true, expense: json.expense };
    }
    return { success: false, error: json.error };
  };

  const updateExpense = async (
    id: number,
    data: {
      description: string;
      amount: number;
      category: string;
      expenseDate: string;
      paymentMethod: string;
    }
  ) => {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) {
      return { success: true, expense: json.expense };
    }
    return { success: false, error: json.error };
  };

  const deleteExpense = async (id: number) => {
    const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok) {
      return { success: true };
    }
    return { success: false, error: json.error };
  };

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}

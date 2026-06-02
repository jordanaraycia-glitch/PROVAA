"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/hooks/useExpenses";
import { useToast } from "@/components/ui/Toast";
import SummaryCards from "@/components/dashboard/SummaryCards";
import ExpenseFiltersComponent from "@/components/dashboard/ExpenseFilters";
import ExpenseTable from "@/components/dashboard/ExpenseTable";
import CategoryBreakdown from "@/components/dashboard/CategoryBreakdown";
import ExpenseDialog from "@/components/expenses/ExpenseDialog";
import DeleteConfirm from "@/components/expenses/DeleteConfirm";
import { Expense, ExpenseFilters } from "@/types";
import { Wallet, Plus, LogOut, TrendingUp } from "lucide-react";

const defaultFilters: ExpenseFilters = {
  category: "all",
  dateFrom: "",
  dateTo: "",
  search: "",
};

export default function DashboardPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const {
    expenses,
    loading,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
  } = useExpenses();
  const { showToast } = useToast();
  const router = useRouter();

  const [filters, setFilters] = useState<ExpenseFilters>(defaultFilters);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editExpense, setEditExpense] = useState<Expense | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Expense | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const loadExpenses = useCallback(
    (f?: ExpenseFilters) => {
      fetchExpenses(f || filters);
    },
    [fetchExpenses, filters]
  );

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }
    if (!authLoading && user) {
      fetchExpenses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user, router]);

  const handleApplyFilters = () => {
    fetchExpenses(filters);
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    fetchExpenses(defaultFilters);
  };

  const handleCreateOrUpdate = async (data: {
    description: string;
    amount: number;
    category: string;
    expenseDate: string;
    paymentMethod: string;
  }) => {
    setSubmitting(true);
    if (editExpense) {
      const result = await updateExpense(editExpense.id, data);
      if (result.success) {
        showToast("Despesa atualizada com sucesso! ✅", "success");
        setDialogOpen(false);
        setEditExpense(null);
        loadExpenses();
      } else {
        showToast(result.error || "Erro ao atualizar despesa", "error");
      }
    } else {
      const result = await createExpense(data);
      if (result.success) {
        showToast("Despesa registrada com sucesso! ✅", "success");
        setDialogOpen(false);
        loadExpenses();
      } else {
        showToast(result.error || "Erro ao criar despesa", "error");
      }
    }
    setSubmitting(false);
  };

  const handleEditClick = (expense: Expense) => {
    setEditExpense(expense);
    setDialogOpen(true);
  };

  const handleDeleteClick = (expense: Expense) => {
    setDeleteTarget(expense);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const result = await deleteExpense(deleteTarget.id);
    if (result.success) {
      showToast("Despesa removida com sucesso!", "success");
      setDeleteOpen(false);
      setDeleteTarget(null);
      loadExpenses();
    } else {
      showToast(result.error || "Erro ao remover despesa", "error");
    }
    setDeleting(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    showToast("Até logo! 👋", "success");
    router.push("/register");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-white animate-pulse" />
          </div>
          <p className="text-slate-500 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-violet-200">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 leading-none">
                  FinanceTrack
                </h1>
                <p className="text-xs text-slate-400 leading-none mt-0.5">
                  Controle de despesas
                </p>
              </div>
            </div>

            {/* User + Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2 border border-slate-100">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700 leading-none">
                    {user.name.split(" ")[0]}
                  </p>
                  <p className="text-xs text-slate-400 leading-none mt-0.5 max-w-[130px] truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all text-sm font-medium border border-transparent hover:border-red-100"
              >
                {loggingOut ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Page Title + CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              {greeting()},{" "}
              <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                {user.name.split(" ")[0]}!
              </span>
            </h2>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-violet-400" />
              Aqui está o resumo das suas finanças
            </p>
          </div>
          <button
            onClick={() => {
              setEditExpense(null);
              setDialogOpen(true);
            }}
            className="hidden sm:flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            Nova Despesa
          </button>
        </div>

        {/* Summary Cards */}
        <SummaryCards expenses={expenses} loading={loading} />

        {/* Two column layout for filters + breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ExpenseFiltersComponent
              filters={filters}
              onChange={setFilters}
              onReset={handleResetFilters}
              onApply={handleApplyFilters}
            />
          </div>
          <div className="lg:col-span-1">
            <CategoryBreakdown expenses={expenses} loading={loading} />
          </div>
        </div>

        {/* Table Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                💳 Minhas Despesas
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {loading
                  ? "Carregando..."
                  : `${expenses.length} despesa${expenses.length !== 1 ? "s" : ""} encontrada${expenses.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <button
              onClick={() => {
                setEditExpense(null);
                setDialogOpen(true);
              }}
              className="sm:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 text-white font-medium text-sm hover:bg-violet-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Adicionar
            </button>
          </div>
          <ExpenseTable
            expenses={expenses}
            loading={loading}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>

        {/* Footer */}
        <footer className="text-center py-4">
          <p className="text-xs text-slate-400">
            FinanceTrack © {new Date().getFullYear()} — Controle suas finanças com inteligência
          </p>
        </footer>
      </main>

      {/* Floating Action Button (mobile) */}
      <button
        onClick={() => {
          setEditExpense(null);
          setDialogOpen(true);
        }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-violet-300 hover:shadow-xl hover:from-violet-700 hover:to-purple-700 transition-all hover:scale-110 sm:hidden z-30"
        title="Nova Despesa"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Expense Dialog */}
      <ExpenseDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditExpense(null);
        }}
        onSubmit={handleCreateOrUpdate}
        expense={editExpense}
        loading={submitting}
      />

      {/* Delete Confirmation */}
      <DeleteConfirm
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        expenseName={deleteTarget?.description}
      />
    </div>
  );
}

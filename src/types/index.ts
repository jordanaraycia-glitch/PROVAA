export type Category =
  | "Alimentação"
  | "Transporte"
  | "Saúde"
  | "Educação"
  | "Lazer"
  | "Outros";

export type PaymentMethod =
  | "Dinheiro"
  | "Débito"
  | "Crédito"
  | "PIX"
  | "Outro";

export interface Expense {
  id: number;
  userId: number;
  description: string;
  amount: string;
  category: Category;
  expenseDate: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface ExpenseFilters {
  category: string;
  dateFrom: string;
  dateTo: string;
  search: string;
}

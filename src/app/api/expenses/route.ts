import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const expenseSchema = z.object({
  description: z
    .string()
    .min(1, "Descrição é obrigatória")
    .max(255, "Descrição muito longa"),
  amount: z.number().positive("Valor deve ser maior que 0"),
  category: z.enum([
    "Alimentação",
    "Transporte",
    "Saúde",
    "Educação",
    "Lazer",
    "Outros",
  ]),
  expenseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  paymentMethod: z.enum(["Dinheiro", "Débito", "Crédito", "PIX", "Outro"]),
});

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const search = searchParams.get("search");

  let query = supabaseServer
    .from("expenses")
    .select("*")
    .eq("user_id", session.userId);

  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  if (dateFrom) {
    query = query.gte("expense_date", dateFrom);
  }
  if (dateTo) {
    query = query.lte("expense_date", dateTo);
  }
  if (search) {
    query = query.ilike("description", `%${search}%`);
  }

  const { data, error } = await query.order("expense_date", { ascending: false }).order("created_at", { ascending: false });

  if (error) {
    console.error("Get expenses error:", error);
    return NextResponse.json({ error: "Erro ao carregar despesas." }, { status: 500 });
  }

  return NextResponse.json({ expenses: data ?? [] });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = expenseSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { description, amount, category, expenseDate, paymentMethod } = parsed.data;

    const { data: expense, error } = await supabaseServer
      .from("expenses")
      .insert({
        user_id: session.userId,
        description,
        amount,
        category,
        expense_date: expenseDate,
        payment_method: paymentMethod,
      })
      .select("*")
      .single();

    if (error || !expense) {
      console.error("Create expense error:", error);
      return NextResponse.json(
        { error: "Erro ao criar despesa. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    console.error("Create expense error:", error);
    return NextResponse.json(
      { error: "Erro ao criar despesa. Tente novamente." },
      { status: 500 }
    );
  }
}

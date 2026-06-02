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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const expenseId = parseInt(id, 10);

  if (isNaN(expenseId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
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

    const { data: updated, error } = await supabaseServer
      .from("expenses")
      .update({
        description,
        amount,
        category,
        expense_date: expenseDate,
        payment_method: paymentMethod,
        updated_at: new Date().toISOString(),
      })
      .eq("id", expenseId)
      .eq("user_id", session.userId)
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116" || error.code === "404") {
        return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
      }
      console.error("Update expense error:", error);
      return NextResponse.json(
        { error: "Erro ao atualizar despesa. Tente novamente." },
        { status: 500 }
      );
    }

    if (!updated) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ expense: updated });
  } catch (error) {
    console.error("Update expense error:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar despesa. Tente novamente." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { id } = await params;
  const expenseId = parseInt(id, 10);

  if (isNaN(expenseId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const { data: deleted, error } = await supabaseServer
      .from("expenses")
      .delete()
      .eq("id", expenseId)
      .eq("user_id", session.userId)
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116" || error.code === "404") {
        return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
      }
      console.error("Delete expense error:", error);
      return NextResponse.json(
        { error: "Erro ao remover despesa. Tente novamente." },
        { status: 500 }
      );
    }

    if (!deleted) {
      return NextResponse.json({ error: "Despesa não encontrada" }, { status: 404 });
    }

    return NextResponse.json({ message: "Despesa removida com sucesso!" });
  } catch (error) {
    console.error("Delete expense error:", error);
    return NextResponse.json(
      { error: "Erro ao remover despesa. Tente novamente." },
      { status: 500 }
    );
  }
}

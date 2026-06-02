import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer } from "@/lib/supabase-server";
import { setSession } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z
    .string()
    .min(8, "Senha deve ter pelo menos 8 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const { data: existing, error: selectError } = await supabaseServer
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (selectError) {
      console.error("Register select error:", selectError);
      return NextResponse.json(
        { error: "Erro ao verificar usuário. Tente novamente." },
        { status: 500 }
      );
    }

    if (existing) {
      return NextResponse.json(
        { error: "Este email já está cadastrado" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { data: user, error: insertError } = await supabaseServer
      .from("users")
      .insert({ name, email, password_hash: passwordHash })
      .select("id,name,email")
      .single();

    if (insertError || !user) {
      console.error("Register insert error:", insertError);
      return NextResponse.json(
        { error: "Erro ao criar conta. Tente novamente." },
        { status: 500 }
      );
    }

    await setSession({
      userId: user.id,
      email: user.email,
      name: user.name,
    });

    return NextResponse.json(
      { message: "Conta criada com sucesso!", user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Erro ao criar conta. Tente novamente." },
      { status: 500 }
    );
  }
}

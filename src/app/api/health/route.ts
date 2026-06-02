import { supabaseServer } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { error } = await supabaseServer
      .from("users")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Health check error:", error);
      return Response.json({ ok: false }, { status: 500 });
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Health catch error:", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}

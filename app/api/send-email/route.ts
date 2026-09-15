import { Resend } from "resend";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/app/lib/supabase-server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Get the authenticated Supabase user
    const supabaseServer = await createSupabaseServerClient();

    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    console.log(
      "SEND EMAIL AUTH USER:",
      user?.id ?? "NO USER"
    );

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Read request body
    const body = await req.json();

    const {
      invoice_id,
      subject,
      html,
    } = body;

    // Invoice ID is required
    if (!invoice_id) {
      return NextResponse.json(
        { error: "Invoice ID is required" },
        { status: 400 }
      );
    }

    // Verify that this invoice belongs to the logged-in user
    const {
      data: invoice,
      error: invoiceError,
    } = await supabaseServer
      .from("invoices")
      .select(
        "id, user_id, email, client_name, projects, amount"
      )
      .eq("id", invoice_id)
      .eq("user_id", user.id)
      .single();

    if (invoiceError || !invoice) {
      console.error(
        "INVOICE OWNERSHIP ERROR:",
        invoiceError
      );

      return NextResponse.json(
        { error: "Invoice not found or unauthorized" },
        { status: 403 }
      );
    }

    // Email subject and HTML are required
    if (!subject || !html) {
      return NextResponse.json(
        { error: "Missing email data" },
        { status: 400 }
      );
    }

    // Send only to the email stored on the verified invoice
    const data = await resend.emails.send({
      from: "Freelancer SaaS <onboarding@resend.dev>",
      to: invoice.email,
      subject,
      html,
    });
console.log("RESEND RESPONSE:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("EMAIL ERROR:", error);

    return NextResponse.json(
      { error: "Email failed." },
      { status: 500 }
    );
  }
}
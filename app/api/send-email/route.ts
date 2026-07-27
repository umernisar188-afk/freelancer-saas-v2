import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { to, subject, html } = body;

    const data = await resend.emails.send({
      from: "Freelancer SaaS <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    return NextResponse.json(data);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Email failed." },
      { status: 500 }
    );
  }
}
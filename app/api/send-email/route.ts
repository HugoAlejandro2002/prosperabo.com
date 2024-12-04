import { EmailTemplate } from "@/components/email-template";
import { Resend } from "resend";
import { resendApi } from "../../../services/config";
// import { NextResponse } from 'next/server';

const resend = new Resend(resendApi);

export async function POST(request: Request) {
  const { username, email, code } = await request.json();
  try {
    const { data, error } = await resend.emails.send({
      from: "Prospera <info@prosperabo.com>",
      to: email,
      // to: ["crowdfunding.prospera@gmail.com"],
      subject: "Código de verificación",
      react: EmailTemplate({ username, code }),
      text: "Código de verificación",
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({
      message: "Correo electrónico enviado con éxito",
      data,
    });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

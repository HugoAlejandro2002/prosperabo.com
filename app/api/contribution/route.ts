import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { baseApiUrl, enviorment } from "../../../services/config";

export async function POST(request: NextRequest) {
  try {
    const projectId = request.nextUrl.searchParams.get("projectId");
    const cookieStore = cookies();
    const token =
      cookieStore.get("__Secure-next-auth.session-token")?.value ||
      cookieStore.get("next-auth.session-token")?.value;

    if (!token) {
      return new NextResponse("No auth token found", { status: 401 });
    }
    console.log(token);

    const xCookieNameToUse =
      enviorment === "development"
        ? "next-auth.session-token"
        : "__Secure-next-auth.session-token";

    const formData = await request.formData();
    const response = await fetch(
      `${baseApiUrl}/contribution/invest/${projectId}`,
      {
        method: "POST",
        body: formData,
        headers: { Cookie: `${xCookieNameToUse}=${token}` },
      },
    );

    console.log("response", response);
    const resToJson = await response.json();
    console.log("resToJson", resToJson);

    if (!response.ok) {
      throw new Error(
        `Fetch error: ${response.statusText}. ${resToJson.message} `,
      );
    }

    return Response.json(resToJson);
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return Response.json(
        { message: error.message, error: error.stack },
        { status: 500 },
      );
    }
    return Response.json({ error: error }, { status: 500 });
  }
}

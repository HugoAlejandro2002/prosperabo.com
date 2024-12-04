// app/api/products/route.ts
// import { NextResponse } from "next/server";

import { baseApiUrl } from "../../../services/config";

export async function GET(request: Request) {
  try {
    // const url = new URL(request.url);
    // const page = url.searchParams.get("page") || "1";
    console.log("SERVER >>>");

    const response = await fetch(
      `${baseApiUrl}/api/projects`,
      // `${baseApiUrl}/api/projects/list?page=${page}`,
      // `/api/projects/list?page=${page}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();
    console.log("SERVER >>>", data);

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

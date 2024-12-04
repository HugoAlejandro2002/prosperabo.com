// src/utils/fetchData.ts
// import { cookies } from "next/headers";

import useAuthStore from "@/stores/auth/token.store";
import { enviorment } from "../../services/config";

const fetchData = async (url: string, options: RequestInit = {}) => {
  try {
    // const sessionToken = req.cookies.next-auth.session-token;
    // const cookieStore = cookies();
    // console.log("cookieStore", cookieStore.get("next-auth.session-token"));
    console.log("fdsfdsf", document.cookie);
    const token = await useAuthStore.getState().token;

    // const token =
    //   getCookie("__Secure-next-auth.session-token") ||
    //   getCookie("next-auth.session-token");
    console.log(" enviorment", enviorment);
    console.log(" token", token);

    if (!token) {
      throw new Error("No auth token found in cookies");
    }

    const xCookieNameToUse =
      enviorment === "development"
        ? "next-auth.session-token"
        : "__Secure-next-auth.session-token";
    console.log(xCookieNameToUse);

    // const headers = new Headers(options.headers || {});
    const headers = new Headers();
    headers.append("Cookie", `${xCookieNameToUse}=${token}`);
    headers.append("Authorization", `Bearer ${token}`);
    // headers.set("Cookie", `${xCookieNameToUse}=${token}`);

    // headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(url, {
      ...options,

      headers: {
        Cookie: `${xCookieNameToUse}=${token}`,
        "Contectttt-Type": "application/json",
        // Auhtorization: `Bearer ${token}`,
        ...headers,
      },
      credentials: "include",
    });

    console.log("response", response);
    const resToJson = await response.json();
    console.log("resToJson", resToJson);

    if (!response.ok) {
      throw new Error(
        `Fetch error: ${response.statusText}. ${resToJson.message} `,
      );
    }

    return resToJson;
  } catch (error) {
    throw error;
  }
};

// Helper function to get the cookie value
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  return null;
};
/* const getCookie = (name: string): string => {
  if (typeof document === "undefined") {
    // Esto asegura que `getCookie` no se ejecuta en el servidor.
    return "";
  }

  const value = `; ${document.cookie}`;
  console.log("value", value);

  const parts = value.split(`; ${name}=`);
  console.log("parts", parts);

  if (parts.length === 2) {
    // const cookieValue = parts.pop().split(';').shift();
    const cookieValue = parts[1].split(";").shift();
    console.log("cookieValue", cookieValue);
    return cookieValue || "";
  }

  return "";
}; */
// const getCookie = (name: string) => {
//   const value = `; ${document.cookie}`;
//   console.log('value', value);

//   const parts = value.split(`; ${name}=`);
//   console.log('parts', parts)
//   if (parts.length === 2) return parts[1].split(";").shift();
//   return "";
// };

export { fetchData };

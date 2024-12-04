import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ms from "ms";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const timeAgo = (timestamp: Date, timeOnly?: boolean): string => {
  if (!timestamp) return "never";
  return `${ms(Date.now() - new Date(timestamp).getTime())}${timeOnly ? "" : " ago"
    }`;
};

export async function fetcher<JSON = any>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const json = await res.json();
    if (json.error) {
      const error = new Error(json.error) as Error & {
        status: number;
      };
      error.status = res.status;
      throw error;
    } else {
      throw new Error("An unexpected error occurred");
    }
  }

  return res.json();
}

export function nFormatter(num: number, digits?: number) {
  if (!num) return "0";
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits || 1).replace(rx, "$1") + item.symbol
    : "0";
}

export function capitalize(str: string) {
  if (!str || typeof str !== "string") return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const truncate = (str: string, length: number) => {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
};

export function formatDateString(date: any) {
  let original = date;
  console.log(typeof date, "DATE", date);

  const dateString = date.toString();
  console.log(dateString.includes("-"), "dateString", dateString);
  // Check if the date string contains the "/" character
  // if (dateString.includes("/")) {
  if (dateString.includes("-") && typeof date !== "object") {
    // Split the date string into its components
    const dateComponents = dateString.split("-");

    // Create a new Date object with the correct components
    // 3-06-2024
    /*  const formattedDate = new Date(
      parseInt(dateComponents[2]),
      parseInt(dateComponents[0]) - 1,
      parseInt(dateComponents[1])
    ); */
    // 2024-06-02
    const formattedDate = new Date(
      parseInt(dateComponents[0]),
      parseInt(dateComponents[1]) - 1,
      parseInt(dateComponents[2]),
    ).toISOString();

    // Return the formatted date in the desired format
    // return formattedDate.toISOString();
    console.log("formattedDate", formattedDate);

    return formattedDate;
  } else {
    // If the date string is already in the correct format, return it as is
    console.log("original", original);
    return original;
  }
}

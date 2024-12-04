// import { Project } from "@prisma/client";
import { publicApiUrl } from "../../services/config";
import { PaginatedResponse, Project } from "../definitions";

// utils/api/products.ts
export async function fetchProjectsForPage(page: number) {
  const response = await fetch(
    `${publicApiUrl}/projects/list?page=${page}`,
  );
  return await response.json();
}
// SCOPE: server requests
// export async function fetchInitialProjects(): Promise<Partial<Project>[]> {
// export async function fetchInitialProjects(): Promise<
// PaginatedResponse<Partial<Project>>
// > {
export async function fetchInitialProjects(): Promise<
  PaginatedResponse<Project>
> {
  // const response = await fetch(`/api/projects?page=1`);
  const response = await fetch(
    `${publicApiUrl}/projects/list?page=1`,
    { cache: "no-store" },
    // { cache: "force-cache" },
    // { next: { revalidate: 15 } },
  );

  if (!response.ok) {
    throw new Error(`API request failed with status code ${response.status}`);
  }
  const data = await response.json();
  console.log("DATA >>>>>>", data);
  return data;
}

export async function fetchProjectById(id: string): Promise<Project> {
  const response = await fetch(
    `${publicApiUrl}/projects/${id}`,
    { cache: "no-store" },
  );
  if (!response.ok) {
    throw new Error(`API request failed with status code ${response.status}`);
  }

  const resTOJSON = await response.json();
  console.log("DTA >>>>>>", resTOJSON.data);
  return resTOJSON.data;
}

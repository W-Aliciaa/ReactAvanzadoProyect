export type SearchParamValue = string | string[] | undefined;

export type ProjectQuery = {
  query: string;
  order: "asc" | "desc";
  page: number;
};

export const PROJECT_PAGE_SIZE = 3;
const PRISMA_INT_MAX = 2_147_483_647;

function first(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function parseProjectQuery(
  queryParams: Record<string, SearchParamValue>,
): ProjectQuery {
  const order = first(queryParams.order);
  const query = first(queryParams.query);
  const page = Number(first(queryParams.page)); // En realidad, deberíamos comprobar edge-cases

  return {
    order: order === "asc" ? "asc" : "desc",
    query,
    page: page < 1 ? 1 : page,
  };
}

export function parseProjectId(value: unknown): number | null {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id <= PRISMA_INT_MAX ? id : null;
}

function projectQueryParams(input: ProjectQuery, page: number) {
  const params = new URLSearchParams();

  if (input.query) params.set("query", input.query);
  if (input.order !== "desc") params.set("order", input.order);
  if (page > 1) params.set("page", String(page));

  return params;
}

export function projectListHref(
  input: ProjectQuery,
  page = input.page,
): string {
  const queryString = projectQueryParams(input, page).toString();
  return queryString ? `/dashboard?${queryString}` : "/dashboard";
}

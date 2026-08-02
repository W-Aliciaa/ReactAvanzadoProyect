export type SearchParamValue = string | string[] | undefined;

export type AdQuery = {
  query: string;
  price?: number;
  tag?: string;
  order: "asc" | "desc";
  page: number;
};

export const AD_PAGE_SIZE = 3;
const PRISMA_INT_MAX = 2_147_483_647;

function first(value: SearchParamValue): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export function parseAdQuery(
  queryParams: Record<string, SearchParamValue>,
): AdQuery {
  const order = first(queryParams.order);
  const query = first(queryParams.query);
  const page = Number(first(queryParams.page));
  const priceStr = first(queryParams.price);
  const tag = first(queryParams.tag);

  return {
    order: order === "asc" ? "asc" : "desc",
    query,
    page: page < 1 ? 1 : page,
    price : priceStr ? Number(priceStr) : undefined,
    tag: tag || undefined,
  };
}

export function parseAdId(value: unknown): number | null {
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const id = Number(value);
  return Number.isSafeInteger(id) && id <= PRISMA_INT_MAX ? id : null;
}

function adQueryParams(input: AdQuery, page: number) {
  const params = new URLSearchParams();

  if (input.query) params.set("query", input.query);
  if (input.order !== "desc") params.set("order", input.order);
  if (page > 1) params.set("page", String(page));
  if (input.price) params.set("price", String(input.price));
  if (input.tag) params.set("tag", input.tag);

  return params;
}

export function adListHref(
  input: AdQuery,
  page = input.page,
): string {
  const queryString = adQueryParams(input, page).toString();
  return queryString ? `/?${queryString}` : "/";
}

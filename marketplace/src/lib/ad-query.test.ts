import { describe, expect, it } from "vitest";
import { adListHref } from "./ad-query";

describe("adListHref", () => {
  it("keeps active filters and omits the default order", () => {
    expect(
      adListHref(
        { query: "react", order: "desc", page: 2 },
        3,
      ),
    ).toBe("/?query=react&page=3");
  });

  it("keeps a non-default order on the canonical URL", () => {
    expect(
      adListHref({ query: "", order: "asc", page: 1 }),
    ).toBe("/?order=asc");
  });

  it("returns the root when all values are defaults", () => {
    expect(
      adListHref({ query: "", order: "desc", page: 1 }),
    ).toBe("/");
  });
});

import { describe, expect, it } from "vitest";
import { projectListHref } from "./project-query";

describe("projectListHref", () => {
  it("keeps active filters and omits the default order", () => {
    expect(
      projectListHref(
        { query: "react", order: "desc", page: 2 },
        3,
      ),
    ).toBe("/dashboard?query=react&page=3");
  });

  it("keeps a non-default order on the canonical URL", () => {
    expect(
      projectListHref({ query: "", order: "asc", page: 1 }),
    ).toBe("/dashboard?order=asc");
  });

  it("returns the dashboard root when all values are defaults", () => {
    expect(
      projectListHref({ query: "", order: "desc", page: 1 }),
    ).toBe("/dashboard");
  });
});

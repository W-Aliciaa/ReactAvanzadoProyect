// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SearchAdForm } from "./search-ad-form";
import { adListHref } from "@/lib/ad-query";

describe("SearchAdForm", () => {
  it("exposes accessible controls and the GET form contract", async () => {
    const user = userEvent.setup();
    render(<SearchAdForm query="old" order="desc" />);

    const query = screen.getByRole("textbox", { name: "Buscar" });
    const order = screen.getByRole("combobox", {
      name: "Ordenar por nombre",
    });
    const form = query.closest("form");

    if (!form) {
      throw new Error("Search form was not rendered");
    }

    expect(form).toHaveAttribute("method", "GET");
    expect(form).toHaveAttribute("action", "/");
    expect(query).toHaveValue("old");
    expect(order).toHaveValue("desc");

    await user.clear(query);
    await user.type(query, "C6");
    await user.selectOptions(order, "asc");

    const data = new FormData(form);
    expect(data.get("query")).toBe("C6");
    expect(data.get("order")).toBe("asc");
    expect(data.get("page")).toBeNull();
    expect(screen.getByRole("link", { name: "Limpiar" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("keeps URL filtering rules in the same public contract", () => {
    expect(
      adListHref({ query: "react", order: "desc", page: 2 }, 3),
    ).toBe("/?query=react&page=3");
  });
});

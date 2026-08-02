"use client";

import { createAd, AdActionState } from "@/app/actions";
import { useActionState } from "react";
import { CreateAdButton } from "../create-ad-button";

const initialState: AdActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export function CreateAdForm() {
  const [state, formAction] = useActionState(createAd, initialState);

  const hasTitleError = Boolean(state.fieldErrors.title?.length);
  const hasDescriptionError = Boolean(state.fieldErrors.description?.length);
  const hasPriceError = Boolean(state.fieldErrors.price?.length);
  const hasTagsError = Boolean(state.fieldErrors.tags?.length);

  return (
    <form action={formAction} className="grid gap-2">
      <label htmlFor="title">Título</label>
      <input
        aria-describedby={hasTitleError ? "title-error" : undefined}
        aria-invalid={hasTitleError}
        id="title"
        name="title"
        className="border"
      />
      {hasTitleError && (
        <div id="title-error" className="text-red-500">
          {state.fieldErrors.title?.join(", ")}
        </div>
      )}

      <label htmlFor="description">Descripción</label>
      <input
        aria-describedby={hasDescriptionError ? "description-error" : undefined}
        aria-invalid={hasDescriptionError}
        id="description"
        name="description"
        className="border"
      />
      {hasDescriptionError && (
        <div id="description-error" className="text-red-500">
          {state.fieldErrors.description?.join(", ")}
        </div>
      )}
      
      <label htmlFor="price">Precio</label>
      <input
        aria-describedby={hasPriceError ? "price-error" : undefined}
        aria-invalid={hasPriceError}
        id="price"
        name="price"
        type="number"
        step="0.01"
        className="border"
      />
      {hasPriceError && (
        <div id="price-error" className="text-red-500">
          {state.fieldErrors.price?.join(", ")}
        </div>
      )}

      <label htmlFor="tags">Etiquetas (separadas por comas)</label>
      <input
        aria-describedby={hasTagsError ? "tags-error" : undefined}
        aria-invalid={hasTagsError}
        id="tags"
        name="tags"
        type="text"
        className="border"
      />
      {hasTagsError && (
        <div id="tags-error" className="text-red-500">
          {state.fieldErrors.tags?.join(", ")}
        </div>
      )}
      
      <CreateAdButton />
      {state.message && <div>{state.message}</div>}
    </form>
  );
}

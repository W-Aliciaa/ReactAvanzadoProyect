"use client";

import { createProject, ProjectActionState } from "@/app/dashboard/actions";
import { useActionState } from "react";
import { CreateProjectButton } from "../create-project-button";

const initialState: ProjectActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export function CreateProjectForm() {
  const [state, formAction] = useActionState(createProject, initialState);

  const hasTitleError = Boolean(state.fieldErrors.title?.length);
  const hasDescriptionError = Boolean(state.fieldErrors.description?.length);

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

      <CreateProjectButton />
      {state.message && <div>{state.message}</div>}
    </form>
  );
}

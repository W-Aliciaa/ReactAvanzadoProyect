"use client";

import { updateProjectTitle } from "@/app/dashboard/actions";
import { FormEvent, useOptimistic, useState, useTransition } from "react";

type OptimisticTitleEditorProps = {
  projectId: number;
  confirmedTitle: string;
  labMode: boolean;
};

export function OptimisticTitleEditor({
  projectId,
  confirmedTitle,
  labMode,
}: OptimisticTitleEditorProps) {
  const [draft, setDraft] = useState(confirmedTitle);
  const [targetId, setTargetId] = useState(String(projectId));
  const [message, setMessage] = useState("");
  const [optimisticTitle, setOptimisticTitle] =
    useOptimistic(confirmedTitle);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const attemptedTitle = draft;
    const attemptedId = labMode ? targetId : String(projectId);
    setMessage("");

    startTransition(async () => {
      setOptimisticTitle(attemptedTitle);
      const result = await updateProjectTitle(attemptedId, attemptedTitle);
      setMessage(
        result.ok ? result.message : `${result.code}: ${result.message}`,
      );

      if (result.ok) {
        setDraft(result.title);
      } else {
        setDraft(confirmedTitle);
      }
    });
  }

  return (
    <section className="grid gap-4" aria-labelledby="project-title">
      <div className="grid gap-1">
        {labMode && (
          <p className="text-sm font-medium text-red-600">
            Laboratorio local: el ID objetivo es controlable
          </p>
        )}
        <h1 id="project-title" className="text-3xl font-semibold tracking-tight">
          {optimisticTitle}
        </h1>
      </div>

      <form className="grid max-w-xl gap-3" onSubmit={handleSubmit}>
        {labMode && (
          <label className="grid gap-1 text-sm" htmlFor="target-project-id">
            ID objetivo del laboratorio
            <input
              className="rounded-lg border border-border bg-background px-3 py-2"
              disabled={isPending}
              id="target-project-id"
              inputMode="numeric"
              onChange={(event) => setTargetId(event.target.value)}
              value={targetId}
            />
          </label>
        )}

        <label className="grid gap-1 text-sm" htmlFor="project-title-input">
          Nuevo título
          <input
            className="rounded-lg border border-border bg-background px-3 py-2"
            disabled={isPending}
            id="project-title-input"
            maxLength={80}
            minLength={3}
            onChange={(event) => setDraft(event.target.value)}
            value={draft}
          />
        </label>

        <button
          className="w-fit rounded-lg bg-foreground px-4 py-2 text-background disabled:opacity-50"
          disabled={isPending}
          type="submit"
        >
          {isPending ? "Guardando..." : "Guardar título"}
        </button>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {message}
        </p>
      </form>
    </section>
  );
}

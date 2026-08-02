"use client";

import { updateAdTitle } from "@/app/actions";
import { FormEvent, useOptimistic, useState, useTransition } from "react";

type OptimisticTitleEditorProps = {
  adId: number;
  confirmedTitle: string;
  labMode: boolean;
};

export function OptimisticTitleEditor({
  adId,
  confirmedTitle,
  labMode,
}: OptimisticTitleEditorProps) {
  const [draft, setDraft] = useState(confirmedTitle);
  const [targetId, setTargetId] = useState(String(adId));
  const [message, setMessage] = useState("");
  const [optimisticTitle, setOptimisticTitle] =
    useOptimistic(confirmedTitle);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const attemptedTitle = draft;
    const attemptedId = labMode ? targetId : String(adId);
    setMessage("");

    startTransition(async () => {
      setOptimisticTitle(attemptedTitle);
      const result = await updateAdTitle(attemptedId, attemptedTitle);
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
    <section className="grid gap-4" aria-labelledby="ad-title">
      <div className="grid gap-1">
        {labMode && (
          <p className="text-sm font-medium text-red-600">
            Laboratorio local: el ID objetivo es controlable
          </p>
        )}
        <h1 id="ad-title" className="text-3xl font-semibold tracking-tight">
          {optimisticTitle}
        </h1>
      </div>

      <form className="grid max-w-xl gap-3" onSubmit={handleSubmit}>
        {labMode && (
          <label className="grid gap-1 text-sm" htmlFor="target-ad-id">
            ID objetivo del laboratorio
            <input
              className="rounded-lg border border-border bg-background px-3 py-2"
              disabled={isPending}
              id="target-ad-id"
              inputMode="numeric"
              onChange={(event) => setTargetId(event.target.value)}
              value={targetId}
            />
          </label>
        )}

        <label className="grid gap-1 text-sm" htmlFor="ad-title-input">
          Nuevo título
          <input
            className="rounded-lg border border-border bg-background px-3 py-2"
            disabled={isPending}
            id="ad-title-input"
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

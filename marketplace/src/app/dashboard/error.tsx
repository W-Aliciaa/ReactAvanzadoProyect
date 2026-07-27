"use client";

import Link from "next/link";
import { useEffect } from "react";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard render failed", { digest: error.digest });
  }, [error]);

  return (
    <section className="mx-auto grid max-w-xl gap-4 py-10">
      <p className="text-sm font-medium text-muted-foreground">
        Error inesperado
      </p>
      <h1 className="text-3xl font-semibold tracking-tight">
        No pudimos mostrar esta parte del dashboard
      </h1>
      <p className="text-muted-foreground">
        Puedes reintentar el render o volver a una zona estable.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-lg bg-foreground px-4 py-2 text-background"
          onClick={reset}
          type="button"
        >
          Reintentar
        </button>
        <Link
          className="rounded-lg border border-border px-4 py-2"
          href="/dashboard"
        >
          Volver al dashboard
        </Link>
      </div>
    </section>
  );
}

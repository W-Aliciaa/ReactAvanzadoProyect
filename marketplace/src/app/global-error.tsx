"use client";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="es">
      <body>
        <main className="mx-auto grid min-h-screen max-w-xl place-content-center gap-4 p-6">
          <h1 className="text-3xl font-semibold">La aplicación no está disponible</h1>
          <p>Reintenta la carga. Si el problema continúa, vuelve más tarde.</p>
          <button onClick={reset} type="button">
            Reintentar
          </button>
        </main>
      </body>
    </html>
  );
}

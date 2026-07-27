import { DEMO_USERS } from "@/lib/demo-users";
import { startDemoSession } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ from?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { from = "/dashboard" } = await searchParams;

  return (
    <main className="mx-auto grid min-h-[70vh] max-w-2xl place-content-center gap-8 px-6 py-12">
      <header className="grid gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Laboratorio local de seguridad
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Elige una identidad de prueba
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Este selector emite una sesión firmada para fixtures A/B. No valida
          credenciales y no representa un login de producción.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(DEMO_USERS).map(([key, user]) => (
          <form action={startDemoSession} key={key}>
            <input name="demoUser" type="hidden" value={key} />
            <input name="from" type="hidden" value={from} />
            <button
              className="grid w-full gap-1 rounded-xl border border-border bg-card p-5 text-left transition-colors hover:bg-muted"
              type="submit"
            >
              <span className="font-semibold">Entrar como {user.displayName}</span>
              <span className="text-sm text-muted-foreground">
                Fixture {key}, con proyecto propio
              </span>
            </button>
          </form>
        ))}
      </div>
    </main>
  );
}

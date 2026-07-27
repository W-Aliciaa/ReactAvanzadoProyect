import { endDemoSession } from "@/app/login/actions";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function UserProfile() {
  const session = await getSession();
  const user = session
    ? await prisma.user.findUnique({
        where: { id: session.userId },
        select: { displayName: true },
      })
    : null;
  const profileName = user?.displayName ?? "Invitado";

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2">
      <span
        aria-hidden="true"
        className="grid size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-xs font-semibold text-foreground"
      >
        {profileName.charAt(0).toLocaleUpperCase("es")}
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">Perfil</span>
        <span
          className="block truncate text-sm font-medium text-foreground"
          title={profileName}
        >
          {profileName}
        </span>
      </span>
      {user ? (
        <form action={endDemoSession} className="ml-auto">
          <button
            className="text-xs text-muted-foreground underline underline-offset-4"
            type="submit"
          >
            Salir
          </button>
        </form>
      ) : (
        <Link
          className="ml-auto text-xs text-muted-foreground underline underline-offset-4"
          href="/login"
        >
          Entrar
        </Link>
      )}
    </div>
  );
}

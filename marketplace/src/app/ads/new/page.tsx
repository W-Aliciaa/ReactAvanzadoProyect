import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateAdForm } from "@/app/components/forms/create-ad-form"; // Ajusta la ruta si es distinta

export default async function NewAdPage() {
  const session = await getSession();

  // Si no está logueado, redirigir al login
  if (!session) {
    redirect("/login?from=/ads/new");
  }

  return (
    <main className="mx-auto max-w-xl p-6 grid gap-6">
      <h1 className="text-2xl font-bold">Crear Nuevo Anuncio</h1>
      <CreateAdForm />
    </main>
  );
}
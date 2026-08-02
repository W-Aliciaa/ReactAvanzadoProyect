import AdSection from "./components/ad-section";
import { getAdsByFilter } from "@/lib/ads";
import { parseAdQuery, adListHref, SearchParamValue } from "@/lib/ad-query";
import { SearchAdForm } from "./components/forms/search-ad-form";
import { Metadata } from "next";
import Link from "next/link";

type HomePageProps = {
  searchParams: Promise<Record<string, SearchParamValue>>;
};

export const metadata: Metadata = {
  title: "Inicio | Marketplace",
  description: "Marketplace de Anuncios",
};

export default async function HomePage({
  searchParams,
}: HomePageProps) {
  const queryParams = await searchParams;
  const input = parseAdQuery(queryParams);
  const { ads, totalPages } = await getAdsByFilter(input);

  console.log("HomePage: queryParams", { queryParams });

  return (
    <main className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Anuncios</h1>
        {/* Enlace para que el middleware lo proteja si el usuario no está logueado */}
        <Link href="/ads/new" className="underline">
          Crear Anuncio
        </Link>
      </div>

      <SearchAdForm 
        query={input.query} 
        order={input.order} 
        price={input.price}
        tag={input.tag}
      />

      <AdSection ads={ads} />

      <nav aria-label="Paginacion de anuncios" className="flex gap-3">
        {input.page > 1 ? (
          <Link href={adListHref(input, input.page - 1)}>Anterior</Link>
        ) : (
          <span aria-disabled="true">Anterior</span>
        )}

        <span aria-current="page">
          Pagina {input.page} de {totalPages}
        </span>

        {input.page < totalPages ? (
          <Link href={adListHref(input, input.page + 1)}>Siguiente</Link>
        ) : (
          <span aria-disabled="true">Siguiente</span>
        )}
      </nav>
    </main>
  );
}
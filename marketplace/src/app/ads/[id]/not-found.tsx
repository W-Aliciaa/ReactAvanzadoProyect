import Link from "next/link";

export default function AdNotFound() {
  return (
    <section className="mx-auto grid max-w-xl gap-4 py-10">
      <p className="text-sm font-medium text-muted-foreground">Error 404</p>
      <h1 className="text-3xl font-semibold tracking-tight">
        Anuncio no encontrado
      </h1>
      <p className="text-muted-foreground">
        El identificador no es válido o el anuncio ya no existe.
      </p>
      <Link className="w-fit underline underline-offset-4" href="/">
        Volver a la pagina principal
      </Link>
    </section>
  );
}

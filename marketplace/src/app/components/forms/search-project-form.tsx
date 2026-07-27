import Link from "next/link";

type SearchProjectFormProps = {
  query: string;
  order: "asc" | "desc";
};

export function SearchProjectForm({ query, order }: SearchProjectFormProps) {
  return (
    <form className="flex gap-4" action="/dashboard" method="GET">
      <label htmlFor="query">Buscar</label>
      <input id="query" name="query" className="border" defaultValue={query} />

      <label htmlFor="order">Ordenar por nombre</label>
      <select id="order" name="order" className="border" defaultValue={order}>
        <option value="desc">Más recientes</option>
        <option value="asc">Más antiguos</option>
      </select>

      <button type="submit">Aplicar</button>
      <Link href="/dashboard">Limpiar</Link>
    </form>
  );
}

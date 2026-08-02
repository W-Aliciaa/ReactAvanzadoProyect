import Link from "next/link";

type SearchAdFormProps = {
  query: string;
  order: "asc" | "desc";
  price?: number;
  tag?: string;
};

export function SearchAdForm({ query, order, price, tag }: SearchAdFormProps) {
  return (
    <form className="flex gap-4" action="/" method="GET">
      <label htmlFor="query">Buscar</label>
      <input id="query" name="query" className="border" defaultValue={query} />

      <label htmlFor="price">Precio máx</label>
      <input id="price" name="price" type="number" className="border" defaultValue={price || ""} />

      <label htmlFor="tag">Categoría</label>
      <input id="tag" name="tag" className="border" defaultValue={tag || ""} />

      <label htmlFor="order">Ordenar por nombre</label>
      <select id="order" name="order" className="border" defaultValue={order}>
        <option value="desc">Más recientes</option>
        <option value="asc">Más antiguos</option>
      </select>

      <button type="submit">Aplicar</button>
      <Link href="/">Limpiar</Link>
    </form>
  );
}

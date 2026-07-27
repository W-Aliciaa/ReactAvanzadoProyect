import ProjectCardSkeleton from "../components/project-card-skeleton";

export default function Loading() {
  return (
    <section aria-busy="true" aria-labelledby="dashboard-loading-title">
      <h1 id="dashboard-loading-title" className="text-2xl font-bold">
        Proyectos
      </h1>
      <p className="sr-only" role="status">
        Cargando proyectos
      </p>

      <div aria-hidden="true" className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => (
          <ProjectCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

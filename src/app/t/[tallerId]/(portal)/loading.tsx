export default function Loading() {
  return <div className="page-loading" aria-label="Cargando"><div className="skeleton h-10 w-56" /><div className="grid gap-4 md:grid-cols-4">{[1,2,3,4].map((item) => <div key={item} className="skeleton h-32" />)}</div><div className="skeleton h-80" /></div>;
}

export default function Loader() {
  return (
    <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="skeleton animate-shimmer h-72 rounded-3xl" />
      ))}
    </div>
  );
}

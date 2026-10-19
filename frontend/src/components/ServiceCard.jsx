function ServiceCard({ icon, title, description }) {
  return (
    <div
      className="group rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
      style={{
        backgroundColor: "var(--surface-secondary)",
        borderColor: "var(--border)",
      }}
    >
      {/* Icon */}
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-yellow-100 text-2xl transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>

      {/* Title */}
      <h3
        className="mt-6 text-xl font-bold"
        style={{
          color: "var(--foreground)",
        }}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="mt-3 leading-7"
        style={{
          color: "var(--muted)",
        }}
      >
        {description}
      </p>

      {/* Learn More */}
      <button
        type="button"
        className="mt-5 font-semibold text-yellow-500 transition-all duration-300 hover:translate-x-1 hover:text-yellow-400"
      >
        Learn More →
      </button>
    </div>
  );
}

export default ServiceCard;
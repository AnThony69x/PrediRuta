"use client";

export function LegendTraffic() {
  const items = [
    { label: "Fluido", color: "bg-green-500" },
    { label: "Moderado", color: "bg-yellow-500" },
    { label: "Pesado", color: "bg-orange-500" },
    { label: "Severo", color: "bg-red-600" },
  ];

  return (
    <div className="rounded-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-2 shadow ring-1 ring-gray-200 dark:ring-gray-700 text-[11px]">
      <div className="font-medium mb-1 text-gray-700 dark:text-gray-200">Leyenda</div>
      <ul className="space-y-1 text-gray-600 dark:text-gray-300">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${it.color}`}></span>
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

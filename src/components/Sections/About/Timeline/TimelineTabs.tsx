import type { TabDolly } from "@types";

interface Props {
  tabs: TabDolly[];
  activa: number;
  onCambiar: (i: number) => void;
}

/** Pestañas de filtro (Trayectoria / Reconocimientos). */
export default function TimelineTabs({ tabs, activa, onCambiar }: Props) {
  return (
    <div className="timeline-tabs" role="tablist" aria-label="Filtrar la línea de tiempo">
      {tabs.map((tab, i) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={i === activa ? "true" : "false"}
          onClick={() => onCambiar(i)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

type MacroBarProps = {
  label: string;
  atual: number;
  meta: number;
  unidade: string;
  tom?: "treino" | "nutricao" | "sodio";
};

const tones = {
  treino: "bg-treino",
  nutricao: "bg-nutricao",
  sodio: "bg-sodio",
};

export function MacroBar({
  label,
  atual,
  meta,
  unidade,
  tom = "nutricao",
}: MacroBarProps) {
  const pct = meta > 0 ? Math.min(100, Math.round((atual / meta) * 100)) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm text-muted">{label}</span>
        <span className="font-mono text-sm tabular-nums">
          {atual}
          <span className="text-muted">
            /{meta}
            {unidade}
          </span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-2">
        <div
          className={`h-full rounded-full ${tones[tom]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

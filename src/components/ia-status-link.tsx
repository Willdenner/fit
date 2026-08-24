import Link from "next/link";
import { Settings } from "lucide-react";
import { isAiGatewayReady } from "@/lib/gemini";

export function IaStatusLink() {
  const ativa = isAiGatewayReady();

  return (
    <Link
      href="/configuracoes"
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        ativa ? "bg-treino-dim text-treino" : "bg-surface-2 text-muted"
      }`}
    >
      <Settings size={14} />
      {ativa ? "IA ativa" : "IA no Vercel"}
    </Link>
  );
}

import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fit — Treino e nutrição",
    short_name: "Fit",
    description:
      "App pessoal de corrida e nutrição, com destaque para sódio e veredito de IA.",
    start_url: "/hoje",
    display: "standalone",
    background_color: "#0c1117",
    theme_color: "#0c1117",
    lang: "pt-BR",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  };
}

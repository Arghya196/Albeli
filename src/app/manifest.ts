import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Albeli — Not so ordinary.",
    short_name: "Albeli",
    description:
      "Thoda hatke, poora desi. Handcrafted fashion jewellery from Delhi, shipped all over India and worldwide.",
    start_url: "/",
    display: "standalone",
    background_color: "#4A0612",
    theme_color: "#4A0612",
    icons: [
      {
        src: "/icon-192x192.png?v=3",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png?v=3",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.png?v=3",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png?v=3",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico?v=3",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}

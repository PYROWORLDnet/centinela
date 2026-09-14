import { useEffect, useState } from "react";

export function useJson(url, { skip = false } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (skip || !url) return;
    let cancelled = false;
    fetch(url)
      .then(async (r) => {
        const type = r.headers.get("content-type") || "";
        if (!r.ok) throw new Error(`No se pudo cargar datos (${r.status})`);
        if (!type.includes("application/json")) {
          throw new Error("El API no respondió con datos. Revisa el deploy del backend.");
        }
        try {
          return await r.json();
        } catch {
          throw new Error("Respuesta inválida del servidor.");
        }
      })
      .then((d) => !cancelled && setData(d))
      .catch((e) => {
        if (cancelled) return;
        const raw = e?.message || "Error de red";
        const friendly =
          /expected pattern|Unexpected token|not valid JSON|is not valid JSON|Failed to fetch|Load failed/i.test(
            raw,
          )
            ? "No se pudo cargar el mapa. El API no está disponible."
            : raw;
        setError(friendly);
      });
    return () => {
      cancelled = true;
    };
  }, [url, skip]);

  return { data, error };
}

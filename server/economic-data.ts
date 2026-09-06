// Keep official series identifiers explicit so unrelated household or hourly series cannot be substituted.
export const SERIES = {
  smvm: "57.1_SMVMM_0_M_34",
  cba: "150.1_CSTA_BARIA_0_D_26",
  cbt: "150.1_CSTA_BATAL_0_D_20",
} as const;

// Reject missing values, unexpected series and future observations instead of inventing defaults.
export function parseSeries(
  payload: any,
  id: string,
  today = new Date().toISOString().slice(0, 10),
) {
  if (!Array.isArray(payload?.data) || payload?.meta?.[1]?.field?.id !== id) {
    throw new Error("Respuesta oficial con formato o serie inesperados.");
  }
  const rows = payload.data.filter(
    (row: any) =>
      Array.isArray(row) &&
      /^\d{4}-\d{2}-01$/.test(row[0]) &&
      row[0] <= today &&
      typeof row[1] === "number" &&
      Number.isFinite(row[1]) &&
      row[1] > 0,
  );
  rows.sort((a: any, b: any) => b[0].localeCompare(a[0]));
  if (!rows.length)
    throw new Error("La fuente no contiene observaciones válidas.");
  const [period, value] = rows[0];
  return {
    value,
    period,
    source: payload.meta[1].dataset.source,
    url: `https://apis.datos.gob.ar/series/api/series/?ids=${id}&last=12&format=json`,
  };
}

// Bound requests and share a short-lived cache without serving stale data after upstream failures.
let cached: { expires: number; data: any } | undefined;
let pending: Promise<any> | undefined;
export function getEconomicData() {
  if (cached && cached.expires > Date.now())
    return Promise.resolve(cached.data);
  if (pending) return pending;
  pending = Promise.all(
    Object.entries(SERIES).map(async ([key, id]) => {
      const url = `https://apis.datos.gob.ar/series/api/series/?ids=${id}&last=12&format=json`;
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok)
        throw new Error(
          `Fuente oficial no disponible (HTTP ${response.status}).`,
        );
      return [key, parseSeries(await response.json(), id)] as const;
    }),
  )
    .then((entries) => {
      const indicators = Object.fromEntries(entries);
      if (
        indicators.cba.period !== indicators.cbt.period ||
        indicators.cbt.value < indicators.cba.value
      ) {
        throw new Error("Canastas oficiales inconsistentes.");
      }
      const data = { indicators, fetchedAt: new Date().toISOString() };
      cached = { data, expires: Date.now() + 15 * 60 * 1000 };
      return data;
    })
    .finally(() => {
      pending = undefined;
    });
  return pending;
}

// Expose only a read-only fixed-source endpoint; no case information leaves the browser.
export async function economicHandler(_req: unknown, res: any) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  try {
    res.end(JSON.stringify(await getEconomicData()));
  } catch (error) {
    res.statusCode = 502;
    res.end(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "No se pudieron consultar las fuentes oficiales.",
      }),
    );
  }
}

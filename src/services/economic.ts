// Persist provenance with each evaluation so official downloads and manual changes remain distinguishable.
import type { EconomicParams } from '../types';
export async function fetchEconomicParams(): Promise<EconomicParams> {
  const response = await fetch('/api/economic-params', { cache: 'no-store', signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error('No se pudieron consultar las fuentes oficiales. Reintente o ingrese valores verificados manualmente.');
  const data = await response.json();
  const { smvm, cba, cbt } = data.indicators || {};
  if (![smvm, cba, cbt].every(item => item && Number.isFinite(item.value) && item.value > 0 && typeof item.period === 'string') || cbt.value < cba.value) {
    throw new Error('La fuente devolvió parámetros inválidos.');
  }
  return { smvm: smvm.value, cba: cba.value, cbt: cbt.value, adultsCount: 1,
    provenance: { mode: 'official', fetchedAt: data.fetchedAt, indicators: data.indicators } };
}

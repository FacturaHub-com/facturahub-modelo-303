// facturahub-modelo-303 — Calcula las casillas principales del Modelo 303 (IVA trimestral).
// Alcance: régimen general, operaciones interiores corrientes. 0 dependencias.
// No sustituye al asesoramiento fiscal; cubre el caso común del autónomo.

export interface Linea {
  /** Base imponible. */
  base: number;
  /** Tipo de IVA aplicado (21, 10, 4, 0). */
  tipo: number;
}

export interface FilaDevengado {
  base: number;
  tipo: number;
  cuota: number;
}

export interface Modelo303 {
  /** Filas de IVA devengado (régimen general), casillas 01-09. Hasta 3 tipos. */
  devengado: FilaDevengado[];
  /** Casilla 27 — Total cuota devengada. */
  casilla27: number;
  /** Casilla 28 — Base de cuotas soportadas deducibles (interiores corrientes). */
  casilla28: number;
  /** Casilla 29 — Cuota soportada deducible. */
  casilla29: number;
  /** Casilla 45 — Total a deducir. */
  casilla45: number;
  /** Casilla 46 — Resultado régimen general (27 − 45). */
  casilla46: number;
  /** Casilla 71 — Resultado de la liquidación. */
  casilla71: number;
  /** Mapa casilla→valor de las casillas numeradas (01-09, 27, 28, 29, 45, 46, 71). */
  casillas: Record<string, number>;
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula el Modelo 303 a partir de las ventas (IVA repercutido) y las compras
 * deducibles (IVA soportado en operaciones interiores corrientes).
 */
export function calcularModelo303(opts: { ventas: Linea[]; compras?: Linea[] }): Modelo303 {
  const ventas = opts.ventas ?? [];
  const compras = opts.compras ?? [];

  // Agrupa ventas por tipo → filas de devengado (orden descendente: 21, 10, 4...).
  const porTipo = new Map<number, number>();
  for (const l of ventas) porTipo.set(l.tipo, (porTipo.get(l.tipo) ?? 0) + l.base);

  const devengado: FilaDevengado[] = [...porTipo.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([tipo, base]) => ({ base: round2(base), tipo, cuota: round2((base * tipo) / 100) }));

  const casilla27 = round2(devengado.reduce((s, f) => s + f.cuota, 0));

  const casilla28 = round2(compras.reduce((s, l) => s + l.base, 0));
  const casilla29 = round2(compras.reduce((s, l) => s + (l.base * l.tipo) / 100, 0));

  const casilla45 = casilla29;
  const casilla46 = round2(casilla27 - casilla45);
  const casilla71 = casilla46;

  // Casillas 01-09: hasta 3 filas (01/02/03, 04/05/06, 07/08/09).
  const casillas: Record<string, number> = {};
  devengado.slice(0, 3).forEach((f, i) => {
    casillas[String(1 + i * 3).padStart(2, '0')] = f.base;
    casillas[String(2 + i * 3).padStart(2, '0')] = f.tipo;
    casillas[String(3 + i * 3).padStart(2, '0')] = f.cuota;
  });
  casillas['27'] = casilla27;
  casillas['28'] = casilla28;
  casillas['29'] = casilla29;
  casillas['45'] = casilla45;
  casillas['46'] = casilla46;
  casillas['71'] = casilla71;

  return { devengado, casilla27, casilla28, casilla29, casilla45, casilla46, casilla71, casillas };
}

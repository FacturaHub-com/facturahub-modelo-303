import { describe, it, expect } from 'vitest';
import { calcularModelo303 } from './index';

describe('calcularModelo303', () => {
  it('caso simple: ventas 21% y compras 21%', () => {
    const r = calcularModelo303({
      ventas: [{ base: 1000, tipo: 21 }],
      compras: [{ base: 200, tipo: 21 }],
    });
    expect(r.casilla27).toBe(210); // devengado
    expect(r.casilla28).toBe(200); // base deducible
    expect(r.casilla29).toBe(42);  // cuota deducible
    expect(r.casilla45).toBe(42);
    expect(r.casilla46).toBe(168); // 210 - 42
    expect(r.casilla71).toBe(168);
  });

  it('agrupa ventas por tipo en filas de devengado', () => {
    const r = calcularModelo303({
      ventas: [
        { base: 1000, tipo: 21 },
        { base: 500, tipo: 21 },
        { base: 300, tipo: 10 },
      ],
    });
    // dos tipos → dos filas, ordenadas 21 luego 10
    expect(r.devengado).toEqual([
      { base: 1500, tipo: 21, cuota: 315 },
      { base: 300, tipo: 10, cuota: 30 },
    ]);
    expect(r.casilla27).toBe(345);
    expect(r.casillas['01']).toBe(1500);
    expect(r.casillas['02']).toBe(21);
    expect(r.casillas['03']).toBe(315);
    expect(r.casillas['04']).toBe(300);
  });

  it('sin compras: resultado = cuota devengada', () => {
    const r = calcularModelo303({ ventas: [{ base: 1000, tipo: 21 }] });
    expect(r.casilla45).toBe(0);
    expect(r.casilla71).toBe(210);
  });
});

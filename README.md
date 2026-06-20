# facturahub-modelo-303

**Parte del ecosistema [FacturaHub](https://facturahub.com?utm_source=github&utm_medium=referral&utm_campaign=modelo-303)** — facturación en España, **Verifactu**, **IVA**, **Modelo 303** y automatización fiscal con IA.

> Calcula las **casillas principales del Modelo 303** (IVA trimestral) desde tus ventas y compras. Para autónomos en España. TypeScript · 0 dependencias · MIT.

## Instalación

```bash
npm i facturahub-modelo-303
```

## Uso

```ts
import { calcularModelo303 } from 'facturahub-modelo-303';

const r = calcularModelo303({
  ventas: [{ base: 1000, tipo: 21 }, { base: 300, tipo: 10 }],  // IVA repercutido
  compras: [{ base: 200, tipo: 21 }],                            // IVA soportado deducible
});

r.casilla27;  // 240  (total cuota devengada)
r.casilla45;  // 42   (total a deducir)
r.casilla71;  // 198  (resultado de la liquidación)
r.casillas;   // { '01':1000, '02':21, '03':210, '04':300, ..., '27':240, '46':198, '71':198 }
```

## API

| Campo | Casilla | Qué es |
|---|---|---|
| `devengado[]` | 01-09 | Filas base/tipo/cuota de IVA repercutido |
| `casilla27` | 27 | Total cuota devengada |
| `casilla28` / `casilla29` | 28 / 29 | Base / cuota soportada deducible (interiores corrientes) |
| `casilla45` | 45 | Total a deducir |
| `casilla46` | 46 | Resultado régimen general (27 − 45) |
| `casilla71` | 71 | Resultado de la liquidación |
| `casillas` | — | Mapa casilla→valor |

## Alcance

Cubre el caso común del autónomo en **régimen general** con **operaciones interiores corrientes**. No contempla todos los regímenes especiales, bienes de inversión, intracomunitarias ni inversión del sujeto pasivo.

> Documentación técnica, **no asesoramiento fiscal**. Revisa siempre tu caso con tu gestor.

---

Hecho por [**FacturaHub**](https://facturahub.com?utm_source=npm&utm_medium=referral&utm_campaign=modelo-303) — facturación con IA para autónomos en España: te preparamos el borrador del **Modelo 303** por casillas desde tus facturas y gastos. Gratis.

## Ecosistema FacturaHub
- 🌐 [FacturaHub](https://facturahub.com?utm_source=github&utm_medium=referral&utm_campaign=modelo-303) — la app (gratis, Verifactu incluido)
- 🔌 [facturahub-api](https://github.com/FacturaHub-com/facturahub-api) — API REST + OpenAPI 3.1
- 🤖 [facturahub-mcp](https://github.com/FacturaHub-com/facturahub-mcp) — servidor MCP (Claude, Cursor, ChatGPT)
- 🧾 [facturahub-verifactu](https://github.com/FacturaHub-com/facturahub-verifactu) — Verifactu por API
- 🧮 Librerías: nif-validator · iva · iban-es · factura-number · verifactu-qr · verifactu-hash · modelo-303
- ⚙️ Automatización: facturahub-n8n · n8n-nodes-facturahub · facturahub-woocommerce · facturahub-shopify

Temas: Verifactu · Facturación electrónica · IVA · Modelo 303 · AEAT · NIF/CIF · Autónomos · MCP · IA · España

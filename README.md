# Semáforo de admisión judicial

React application with a same-origin Node server for Argentine public economic data.

## Run

Use Node 22.12+ and npm:

```sh
npm ci
npm run dev
```

Production (a Node server is required; a static-only host cannot serve the API):

```sh
npm run build
npm start
```

Default port: 3000. Set `PORT` for production. No Gemini or other API key is required.

## Official connections

`GET /api/economic-params` queries the [Datos Argentina time-series API](https://apis.datos.gob.ar/series/):

- Monthly SMVM: `57.1_SMVMM_0_M_34`, sourced from the national labor authority.
- INDEC CBA per adult equivalent: `150.1_CSTA_BARIA_0_D_26`.
- INDEC CBT per adult equivalent: `150.1_CSTA_BATAL_0_D_20`.

The baskets are the Gran Buenos Aires reference, not a Necochea-specific measurement. The client displays each observation period and source link. Latest available observations can lag the current month; a successful download does not certify that a series is current. The server validates series identifiers, positive numeric values, publication periods and basket consistency, with a 15-minute memory cache and a 15-second upstream timeout. Failures return HTTP 502 and never substitute made-up values. Existing values are retained with an error message. Manual changes are labeled and stored as manual data.

Household income, rent, health costs, AUH actually received and case details are entered by the operator. No private case data is sent to the public API. Case history and drafts remain in browser storage; this is not an integration with the private SIMP case system. The four legacy demo history records are removed; real history is preserved. Existing drafts are retained, but economic values without provenance are refreshed.

The existing admission rules and equivalence coefficients remain application policy, not rules supplied or legally validated by the economic API. Confirm them against the applicable Necochea agreement before operational use. The displayed child CBT contribution is a calculation from equivalent-adult coefficients, not the separate INDEC canasta de crianza (which includes care costs).

## Checks

```sh
npm run lint
npm test
npm run build
curl http://localhost:3000/api/economic-params
```

Tests cover series identity, null/invalid amounts, observation ordering and future dates. JSON package files do not support intent comments; code changes use comments where the language supports them.

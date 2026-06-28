# GainForest Lexplorer

An explorer for the [GainForest](https://gainforest.net) ATProto lexicon schemas —
a clone of [lexicons.bio](https://lexicons.bio) adapted to GainForest's full schema set
(48 lexicons across 16 namespaces).

It keeps lexicons.bio's editorial design language — warm paper palette, forest/moss
green, the DNA-helix mark, Inter / Fraunces / JetBrains Mono — and renders our lexicons
through the same kind of field tables and star-schema diagram.

## Stack

- **Vite 7** + **React 19** + **TypeScript**
- **MUI 7** (Emotion) for the `sx`-based styling, matching the source site
- **react-router-dom 7** with `HashRouter` (routes like `/#/app.gainforest.dwc.occurrence`)

## How it works

Every schema under [`lexicons/`](./lexicons) is loaded at build time via Vite's
`import.meta.glob`, so the explorer stays in sync with the schemas with no hand-authoring:

- **`src/data/lexicons.ts`** — loads all schemas, groups them by namespace, and provides
  helpers that normalise any def kind (`record`, `object`, `query`, `token`, `string`
  enum, `union`, `array`) into a renderable view, plus type/constraint labelling and
  cross-lexicon ref resolution.
- **`src/pages/Overview.tsx`** — intro, Darwin Core star-schema diagram, and the full
  catalog grouped by namespace.
- **`src/pages/LexiconPage.tsx`** — a page per lexicon (`/:nsid`) showing the primary def,
  all `#defs`, the raw schema JSON, and prev/next navigation.
- **`src/components/`** — `Layout` (top bar + namespace sidebar + footer), `FieldTable`,
  `DefBlock`, `SchemaGraph`, `HelixMark`.
- **`src/theme.ts`** — the palette/typography tokens lifted from lexicons.bio.

The `lexicons/` directory is a copy of the schemas from the
[`GainForest/lexicons`](https://github.com/GainForest) repo. To refresh, re-copy that
repo's `lexicons/` folder over this one.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

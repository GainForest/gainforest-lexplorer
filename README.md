# GainForest Lexplorer

An explorer for the ATProto lexicon schemas used by [GainForest](https://gainforest.net) —
a clone of [lexicons.bio](https://lexicons.bio) adapted to our schema set.

It keeps lexicons.bio's editorial design language — warm paper palette, forest/moss
green, the DNA-helix mark, Inter / Fraunces / JetBrains Mono — and renders our lexicons
through the same kind of field tables and star-schema diagram.

## Surfaced schemas

The `lexicons/` directory holds every schema, but the explorer only surfaces the
sections configured in `SECTIONS` (see `src/data/lexicons.ts`). Currently:

- **Darwin Core** & **Audiovisual Core** — biodiversity records (`app.gainforest.dwc`, `app.gainforest.ac`)
- **Certified** — identity primitives (`app.certified.*`), from [hypercerts-org/hypercerts-lexicon](https://github.com/hypercerts-org/hypercerts-lexicon)
- **Hypercerts** — activity claims, collections, funding receipts, attachments,
  workscope, and shared types (`org.hypercerts.*`), from the same repo

Lexicons outside these sections stay in `lexicons/` (so refs to them still resolve as
labels) but aren't shown. To surface another, add a `{ prefix, title, blurb }` entry to
`SECTIONS`.

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

The `lexicons/` directory holds copies of schemas from two upstreams:
[`GainForest/lexicons`](https://github.com/GainForest) (the `app.gainforest.*` set) and
[`hypercerts-org/hypercerts-lexicon`](https://github.com/hypercerts-org/hypercerts-lexicon)
(the `app.certified.*` and `org.hypercerts.*` sets). To refresh, re-copy the relevant
folders from those repos over this one.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build to dist/
npm run preview  # preview the production build
```

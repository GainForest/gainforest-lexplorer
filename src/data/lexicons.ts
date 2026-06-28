// Generic registry over every ATProto lexicon JSON in /lexicons.
// Loaded at build time via Vite's import.meta.glob so new schemas appear
// automatically with no hand-authoring.

export interface LexiconProperty {
  type: string;
  format?: string;
  description?: string;
  ref?: string;
  refs?: string[];
  items?: LexiconProperty;
  // string / numeric constraints seen across our schemas
  maxLength?: number;
  minLength?: number;
  maxGraphemes?: number;
  minGraphemes?: number;
  minimum?: number;
  maximum?: number;
  default?: string | number | boolean;
  const?: string | number | boolean;
  enum?: string[];
  knownValues?: string[];
  // blob
  accept?: string[];
  maxSize?: number;
  // union
  closed?: boolean;
}

export interface LexiconDef {
  type: string;
  description?: string;
  key?: string;
  // record
  record?: { type: string; required?: string[]; properties?: Record<string, LexiconProperty> };
  // object
  required?: string[];
  properties?: Record<string, LexiconProperty>;
  // query / procedure
  parameters?: { properties?: Record<string, LexiconProperty>; required?: string[] };
  input?: { encoding?: string; schema?: LexiconDef };
  output?: { encoding?: string; schema?: LexiconDef };
  // string token-ish / array / union
  enum?: string[];
  knownValues?: string[];
  items?: LexiconProperty;
  refs?: string[];
  closed?: boolean;
}

export interface LexiconDoc {
  lexicon: number;
  id: string;
  description?: string;
  defs: Record<string, LexiconDef>;
}

// --- load every schema ---------------------------------------------------

const modules = import.meta.glob<LexiconDoc>("../../lexicons/**/*.json", {
  eager: true,
  import: "default",
});

// Focus the explorer on the two biodiversity standards: Darwin Core and
// Audiovisual Core. Other namespaces stay in /lexicons but are not surfaced.
const FOCUS_NAMESPACES = ["app.gainforest.dwc", "app.gainforest.ac"];

export const LEXICONS: LexiconDoc[] = Object.values(modules)
  .filter(
    (m) =>
      m &&
      typeof m.id === "string" &&
      m.defs &&
      FOCUS_NAMESPACES.includes(m.id.slice(0, m.id.lastIndexOf(".")))
  )
  .sort((a, b) => a.id.localeCompare(b.id));

export const byId = new Map(LEXICONS.map((l) => [l.id, l]));

// --- namespace grouping --------------------------------------------------

export interface Group {
  ns: string;
  title: string;
  blurb: string;
  lexicons: LexiconDoc[];
}

interface GroupMeta {
  ns: string;
  title: string;
  blurb: string;
}

const GROUP_META: GroupMeta[] = [
  { ns: "app.gainforest.dwc", title: "Darwin Core", blurb: "Biodiversity occurrence records aligned with the TDWG Simple Darwin Core standard. Occurrences reference a shared event; measurements reference an occurrence." },
  { ns: "app.gainforest.ac", title: "Audiovisual Core", blurb: "Media and passive-acoustic-monitoring records aligned with TDWG Audiovisual Core. Audio and multimedia link to a Darwin Core occurrence as evidence." },
];

function namespaceOf(id: string): string {
  return id.slice(0, id.lastIndexOf("."));
}

export const GROUPS: Group[] = (() => {
  const byNs = new Map<string, LexiconDoc[]>();
  for (const lex of LEXICONS) {
    const ns = namespaceOf(lex.id);
    if (!byNs.has(ns)) byNs.set(ns, []);
    byNs.get(ns)!.push(lex);
  }
  const groups: Group[] = [];
  const used = new Set<string>();
  for (const meta of GROUP_META) {
    const lexicons = byNs.get(meta.ns);
    if (lexicons && lexicons.length) {
      groups.push({ ...meta, lexicons });
      used.add(meta.ns);
    }
  }
  // any namespace without explicit metadata, appended alphabetically
  for (const ns of [...byNs.keys()].sort()) {
    if (used.has(ns)) continue;
    groups.push({ ns, title: ns, blurb: "", lexicons: byNs.get(ns)! });
  }
  return groups;
})();

export function groupOf(id: string): Group | undefined {
  return GROUPS.find((g) => g.lexicons.some((l) => l.id === id));
}

// --- per-lexicon helpers -------------------------------------------------

/** Short label for a lexicon (last NSID segment). */
export function shortName(id: string): string {
  return id.slice(id.lastIndexOf(".") + 1);
}

/** The "main" def name if present, else the first def. */
export function mainDefName(doc: LexiconDoc): string {
  return "main" in doc.defs ? "main" : Object.keys(doc.defs)[0];
}

/** A human description for catalog rows. */
export function lexiconDescription(doc: LexiconDoc): string {
  if (doc.description) return doc.description;
  const main = doc.defs[mainDefName(doc)];
  return main?.description ?? "";
}

export type DefKind =
  | "record"
  | "object"
  | "query"
  | "procedure"
  | "subscription"
  | "token"
  | "string"
  | "array"
  | "union"
  | "other";

export interface FlatField extends LexiconProperty {
  name: string;
  required: boolean;
}

export interface DefView {
  kind: DefKind;
  description?: string;
  /** record key, e.g. "tid" / "literal:self" */
  key?: string;
  /** main object/record/query-parameter fields */
  fields: FlatField[];
  /** for token/string enum defs */
  values?: string[];
  /** for union defs */
  refs?: string[];
  /** query / procedure output schema, summarized */
  outputFields?: FlatField[];
  outputRef?: string;
}

function fieldsFrom(
  properties: Record<string, LexiconProperty> | undefined,
  required: string[] | undefined
): FlatField[] {
  const req = new Set(required ?? []);
  return Object.entries(properties ?? {}).map(([name, prop]) => ({
    ...prop,
    name,
    required: req.has(name),
  }));
}

/** Normalize any def into a renderable view. */
export function viewDef(def: LexiconDef): DefView {
  const kind = (def.type as DefKind) ?? "other";
  switch (def.type) {
    case "record":
      return {
        kind: "record",
        description: def.description,
        key: def.key,
        fields: fieldsFrom(def.record?.properties, def.record?.required),
      };
    case "object":
      return {
        kind: "object",
        description: def.description,
        fields: fieldsFrom(def.properties, def.required),
      };
    case "query":
    case "procedure":
    case "subscription": {
      const out = def.output?.schema;
      return {
        kind: kind,
        description: def.description,
        fields: fieldsFrom(def.parameters?.properties, def.parameters?.required),
        outputFields: out
          ? fieldsFrom(out.properties, out.required)
          : undefined,
        outputRef: undefined,
      };
    }
    case "token":
      return { kind: "token", description: def.description, fields: [] };
    case "string":
      return {
        kind: "string",
        description: def.description,
        fields: [],
        values: def.knownValues ?? def.enum,
      };
    case "array":
      return {
        kind: "array",
        description: def.description,
        fields: [],
        refs: def.items?.ref ? [def.items.ref] : undefined,
      };
    default:
      return { kind: "other", description: def.description, fields: [] };
  }
}

// --- type & constraint labelling ----------------------------------------

function refTail(ref: string): string {
  if (ref.startsWith("#")) return ref;
  // app.gainforest.common.defs#richtext -> defs#richtext  ;  ...strongRef -> strongRef
  const [base, anchor] = ref.split("#");
  const tail = base.slice(base.lastIndexOf(".") + 1);
  return anchor ? `${tail}#${anchor}` : tail;
}

/** A compact, human-readable type label for a property. */
export function typeLabel(prop: LexiconProperty): string {
  const t = prop.type ?? "";
  if (t === "ref") return prop.ref ? refTail(prop.ref) : "ref";
  if (t === "union") {
    const n = prop.refs?.length ?? 0;
    return n ? `union<${prop.refs!.map(refTail).join(" | ")}>` : "union";
  }
  if (t === "array") {
    const items = prop.items;
    if (!items) return "array";
    if (items.type === "ref" && items.ref) return `${refTail(items.ref)}[]`;
    if (items.type === "union") return `union[]`;
    return `${items.format ?? items.type}[]`;
  }
  if (t === "blob") return "blob";
  if (prop.format) return prop.format;
  return t;
}

/** All ref targets referenced by a property (for cross-linking). */
export function refsOf(prop: LexiconProperty): string[] {
  const out: string[] = [];
  if (prop.ref) out.push(prop.ref);
  if (prop.refs) out.push(...prop.refs);
  if (prop.items?.ref) out.push(prop.items.ref);
  if (prop.items?.refs) out.push(...prop.items.refs);
  return out;
}

export interface RefLink {
  label: string;
  /** route to a lexicon page, or undefined if not in registry */
  to?: string;
  anchor?: string;
}

/** Resolve a ref string to a link into this site (when possible). */
export function resolveRef(ref: string, currentId: string): RefLink {
  const [base, anchor] = ref.split("#");
  if (ref.startsWith("#")) {
    // local def in the current lexicon
    return { label: ref, to: `/${currentId}`, anchor };
  }
  if (byId.has(base)) {
    return { label: refTail(ref), to: `/${base}`, anchor };
  }
  return { label: refTail(ref) };
}

/** A compact constraints label for a property. */
export function constraintsLabel(prop: LexiconProperty): string {
  const parts: string[] = [];
  const maxChars = prop.maxGraphemes ?? prop.maxLength;
  const minChars = prop.minGraphemes ?? prop.minLength;
  if (minChars !== undefined) parts.push(`min ${minChars}`);
  if (maxChars !== undefined) parts.push(`max ${maxChars}`);
  if (prop.minimum !== undefined) parts.push(`≥ ${prop.minimum}`);
  if (prop.maximum !== undefined) parts.push(`≤ ${prop.maximum}`);
  if (prop.maxSize !== undefined) parts.push(`≤ ${formatBytes(prop.maxSize)}`);
  if (prop.accept?.length) parts.push(prop.accept.join(", "));
  if (prop.default !== undefined) parts.push(`default: ${prop.default}`);
  if (prop.const !== undefined) parts.push(`const: ${prop.const}`);
  return parts.join(" · ");
}

/** Enum / knownValues for a property, if any. */
export function valuesOf(prop: LexiconProperty): string[] | undefined {
  return prop.enum ?? prop.knownValues;
}

function formatBytes(n: number): string {
  if (n >= 1024 * 1024) return `${Math.round(n / (1024 * 1024))}MB`;
  if (n >= 1024) return `${Math.round(n / 1024)}KB`;
  return `${n}B`;
}

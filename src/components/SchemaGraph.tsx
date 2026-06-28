import { palette, fonts } from "../theme";

// How the focused records relate:
//   dwc.occurrence  → dwc.event        (eventRef)
//   dwc.measurement → dwc.occurrence   (occurrenceRef)
//   ac.media/audio  → dwc.occurrence   (occurrenceRef)
export default function SchemaGraph() {
  const mono = fonts.mono;
  return (
    <svg
      viewBox="0 0 720 230"
      style={{ width: "100%", display: "block", maxWidth: 640, margin: "0 auto" }}
      role="img"
      aria-label="Darwin Core star schema: event, occurrence, measurement, and Audiovisual Core media"
    >
      <defs>
        <marker
          id="schema-arr"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={palette.moss} />
        </marker>
      </defs>

      {/* edges */}
      <line x1="280" y1="78" x2="196" y2="78" stroke={palette.moss} strokeWidth="1" markerEnd="url(#schema-arr)" />
      <line x1="440" y1="78" x2="524" y2="78" stroke={palette.moss} strokeWidth="1" markerEnd="url(#schema-arr)" />
      <line x1="360" y1="116" x2="360" y2="168" stroke={palette.moss} strokeWidth="1" markerEnd="url(#schema-arr)" />

      <text x="238" y="70" fontSize="11" fill={palette.moss} fontFamily={mono} textAnchor="middle">eventRef</text>
      <text x="482" y="70" fontSize="11" fill={palette.moss} fontFamily={mono} textAnchor="middle">occurrenceRef</text>
      <text x="372" y="148" fontSize="11" fill={palette.moss} fontFamily={mono} textAnchor="start">occurrenceRef</text>

      {/* event */}
      <g>
        <rect x="40" y="54" width="156" height="48" fill={palette.bg} stroke={palette.ink} strokeWidth="1" />
        <text x="118" y="78" fontSize="13" fontFamily={mono} fill={palette.ink} textAnchor="middle">event</text>
        <text x="118" y="93" fontSize="10" fontFamily={mono} fill={palette.inkFaint} textAnchor="middle">sampling context</text>
      </g>

      {/* occurrence (focus) */}
      <g>
        <rect x="280" y="44" width="160" height="68" fill={palette.forest} stroke={palette.forest} />
        <text x="360" y="68" fontSize="14" fontFamily={mono} fill={palette.bg} textAnchor="middle">occurrence</text>
        <text x="360" y="85" fontSize="10" fontFamily={mono} fill="rgba(251,250,246,0.72)" textAnchor="middle">·scientificName</text>
        <text x="360" y="99" fontSize="10" fontFamily={mono} fill="rgba(251,250,246,0.72)" textAnchor="middle">·eventDate</text>
      </g>

      {/* measurement */}
      <g>
        <rect x="524" y="54" width="156" height="48" fill={palette.bg} stroke={palette.ink} strokeWidth="1" />
        <text x="602" y="78" fontSize="13" fontFamily={mono} fill={palette.ink} textAnchor="middle">measurement</text>
        <text x="602" y="93" fontSize="10" fontFamily={mono} fill={palette.inkFaint} textAnchor="middle">measurement or fact</text>
      </g>

      {/* ac media / audio */}
      <g>
        <rect x="280" y="170" width="160" height="48" fill={palette.bg} stroke={palette.moss} strokeWidth="1" />
        <text x="360" y="194" fontSize="13" fontFamily={mono} fill={palette.moss} textAnchor="middle">media · audio</text>
        <text x="360" y="209" fontSize="10" fontFamily={mono} fill={palette.inkFaint} textAnchor="middle">audiovisual evidence</text>
      </g>
    </svg>
  );
}

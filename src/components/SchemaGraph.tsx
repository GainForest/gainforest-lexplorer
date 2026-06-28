import { palette, fonts } from "../theme";

// How the focused records relate:
//   dwc.occurrence  → dwc.event        (eventRef)
//   dwc.measurement → dwc.occurrence   (occurrenceRef)
//   ac.media/audio  → dwc.occurrence   (occurrenceRef)
export default function SchemaGraph() {
  const mono = fonts.mono;
  return (
    <svg
      viewBox="0 0 780 300"
      style={{ width: "100%", display: "block", maxWidth: 680, margin: "0 auto" }}
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
      <line x1="300" y1="116" x2="190" y2="116" stroke={palette.moss} strokeWidth="1" markerEnd="url(#schema-arr)" />
      <line x1="480" y1="116" x2="590" y2="116" stroke={palette.moss} strokeWidth="1" markerEnd="url(#schema-arr)" />
      <line x1="390" y1="160" x2="390" y2="232" stroke={palette.moss} strokeWidth="1" markerEnd="url(#schema-arr)" />

      <text x="245" y="106" fontSize="11" fill={palette.moss} fontFamily={mono} textAnchor="middle">eventRef</text>
      <text x="535" y="106" fontSize="11" fill={palette.moss} fontFamily={mono} textAnchor="middle">occurrenceRef</text>
      <text x="404" y="200" fontSize="11" fill={palette.moss} fontFamily={mono} textAnchor="start">occurrenceRef</text>

      {/* event */}
      <g>
        <rect x="30" y="90" width="160" height="52" fill={palette.bg} stroke={palette.ink} strokeWidth="1" />
        <text x="110" y="116" fontSize="13" fontFamily={mono} fill={palette.ink} textAnchor="middle">event</text>
        <text x="110" y="132" fontSize="10" fontFamily={mono} fill={palette.inkFaint} textAnchor="middle">sampling context</text>
      </g>

      {/* occurrence (focus) */}
      <g>
        <rect x="300" y="78" width="180" height="76" fill={palette.forest} stroke={palette.forest} />
        <text x="390" y="104" fontSize="14" fontFamily={mono} fill={palette.bg} textAnchor="middle">occurrence</text>
        <text x="390" y="123" fontSize="10" fontFamily={mono} fill="rgba(251,250,246,0.72)" textAnchor="middle">·scientificName</text>
        <text x="390" y="138" fontSize="10" fontFamily={mono} fill="rgba(251,250,246,0.72)" textAnchor="middle">·eventDate</text>
      </g>

      {/* measurement */}
      <g>
        <rect x="590" y="90" width="160" height="52" fill={palette.bg} stroke={palette.ink} strokeWidth="1" />
        <text x="670" y="116" fontSize="13" fontFamily={mono} fill={palette.ink} textAnchor="middle">measurement</text>
        <text x="670" y="132" fontSize="10" fontFamily={mono} fill={palette.inkFaint} textAnchor="middle">measurement or fact</text>
      </g>

      {/* ac media / audio */}
      <g>
        <rect x="300" y="234" width="180" height="52" fill={palette.bg} stroke={palette.moss} strokeWidth="1" />
        <text x="390" y="260" fontSize="13" fontFamily={mono} fill={palette.moss} textAnchor="middle">media · audio</text>
        <text x="390" y="276" fontSize="10" fontFamily={mono} fill={palette.inkFaint} textAnchor="middle">audiovisual evidence</text>
      </g>
    </svg>
  );
}

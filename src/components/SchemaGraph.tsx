import { palette, fonts } from "../theme";

// The Darwin Core star schema used across app.gainforest.dwc:
// occurrences reference a shared event; measurements reference an occurrence.
export default function SchemaGraph() {
  return (
    <svg
      viewBox="0 0 700 140"
      style={{ width: "100%", display: "block" }}
      role="img"
      aria-label="Darwin Core star schema: occurrence references event, measurement references occurrence"
    >
      <defs>
        <marker
          id="schema-arr"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={palette.moss} />
        </marker>
      </defs>

      <line x1="285" y1="70" x2="158" y2="70" stroke={palette.moss} strokeWidth="1" markerEnd="url(#schema-arr)" />
      <line x1="415" y1="70" x2="542" y2="70" stroke={palette.moss} strokeWidth="1" markerEnd="url(#schema-arr)" />
      <text x="220" y="62" fontSize="10" fill={palette.moss} fontFamily={fonts.mono} textAnchor="middle">
        eventRef
      </text>
      <text x="480" y="62" fontSize="10" fill={palette.moss} fontFamily={fonts.mono} textAnchor="middle">
        occurrenceRef
      </text>

      <g>
        <rect x="20" y="45" width="135" height="50" fill={palette.bg} stroke={palette.ink} strokeWidth="1" />
        <text x="32" y="65" fontSize="12" fontFamily={fonts.mono} fill={palette.ink}>event</text>
        <text x="32" y="83" fontSize="10" fontFamily={fonts.mono} fill={palette.inkFaint}>sampling</text>
      </g>
      <g>
        <rect x="285" y="35" width="130" height="70" fill={palette.forest} stroke={palette.forest} />
        <text x="297" y="57" fontSize="13" fontFamily={fonts.mono} fill={palette.bg}>occurrence</text>
        <text x="297" y="75" fontSize="10" fontFamily={fonts.mono} fill="rgba(251,250,246,0.7)">·scientificName</text>
        <text x="297" y="91" fontSize="10" fontFamily={fonts.mono} fill="rgba(251,250,246,0.55)">·eventDate ·basisOfRecord</text>
      </g>
      <g>
        <rect x="545" y="45" width="135" height="50" fill={palette.bg} stroke={palette.ink} strokeWidth="1" />
        <text x="557" y="65" fontSize="12" fontFamily={fonts.mono} fill={palette.ink}>measurement</text>
        <text x="557" y="83" fontSize="10" fontFamily={fonts.mono} fill={palette.inkFaint}>fact</text>
      </g>
    </svg>
  );
}

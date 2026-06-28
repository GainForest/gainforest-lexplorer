import { useParams, Navigate, Link } from "react-router-dom";
import { Box } from "@mui/material";
import DefBlock from "../components/DefBlock";
import {
  byId,
  groupOf,
  mainDefName,
  lexiconDescription,
  shortName,
} from "../data/lexicons";
import { palette, fonts } from "../theme";

export default function LexiconPage() {
  const { slug } = useParams<{ slug: string }>();
  const doc = slug ? byId.get(slug) : undefined;
  if (!doc) return <Navigate to="/" replace />;

  const lexId = doc.id;
  const lastDot = lexId.lastIndexOf(".");
  const nsidPrefix = lexId.slice(0, lastDot + 1);
  const nsidName = lexId.slice(lastDot + 1);

  const mainName = mainDefName(doc);
  const otherDefs = Object.entries(doc.defs).filter(([name]) => name !== mainName);

  const group = groupOf(lexId);
  const siblings = group?.lexicons ?? [];
  const idx = siblings.findIndex((l) => l.id === lexId);
  const prev = idx > 0 ? siblings[idx - 1] : undefined;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : undefined;

  const rawSchema = JSON.stringify(doc, null, 2);

  return (
    <>
      {group && (
        <Box sx={{ fontFamily: fonts.mono, fontSize: "11px", color: palette.inkFaint, mb: "10px" }}>
          <Box component={Link} to="/" sx={{ color: palette.inkFaint, textDecoration: "none" }}>
            Overview
          </Box>
          {"  /  "}
          <Box component="span" sx={{ color: palette.inkSoft }}>{group.title}</Box>
        </Box>
      )}

      <Box
        component="h2"
        sx={{
          fontFamily: fonts.serif,
          fontSize: { xs: "20px", sm: "24px" },
          fontWeight: 600,
          letterSpacing: "-0.005em",
          m: "0 0 6px",
          color: palette.ink,
          borderTop: `1px solid ${palette.rule}`,
          pt: "26px",
          overflowWrap: "anywhere",
        }}
      >
        <Box component="span" sx={{ fontFamily: fonts.mono, fontSize: "14px", color: palette.inkFaint, fontWeight: 400 }}>
          {nsidPrefix}
        </Box>
        <Box component="span" sx={{ fontFamily: fonts.mono }}>{nsidName}</Box>
      </Box>

      <Box component="p" sx={{ color: palette.inkSoft, fontSize: "14.5px", m: "0 0 24px", maxWidth: 660 }}>
        {lexiconDescription(doc)}
      </Box>

      <DefBlock name={mainName} def={doc.defs[mainName]} lexiconId={lexId} primary />

      {otherDefs.length > 0 && (
        <Box
          component="h3"
          sx={{
            fontFamily: fonts.serif,
            fontSize: "16px",
            fontWeight: 600,
            m: "8px 0 12px",
            color: palette.inkSoft,
            borderTop: `1px solid ${palette.rule}`,
            pt: "20px",
          }}
        >
          Definitions
        </Box>
      )}
      {otherDefs.map(([name, def]) => (
        <DefBlock key={name} name={name} def={def} lexiconId={lexId} />
      ))}

      <Box
        component="details"
        sx={{
          mb: "32px",
          "& > summary": {
            fontFamily: fonts.mono,
            fontSize: "12px",
            color: palette.inkSoft,
            cursor: "pointer",
            py: "6px",
            borderTop: `1px solid ${palette.rule}`,
            listStyle: "none",
          },
          "& > summary::-webkit-details-marker": { display: "none" },
        }}
      >
        <Box component="summary">▸ raw schema (JSON)</Box>
        <Box
          component="pre"
          sx={{
            fontFamily: fonts.mono,
            fontSize: "11.5px",
            background: palette.bgPanel,
            p: "14px",
            m: "8px 0 0",
            overflow: "auto",
            color: palette.ink,
            lineHeight: 1.65,
            border: "none",
          }}
        >
          {rawSchema}
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: "16px",
          borderTop: `1px solid ${palette.rule}`,
          pt: "16px",
          fontSize: "12.5px",
        }}
      >
        {prev && (
          <Box component={Link} to={`/${prev.id}`} sx={{ color: palette.link, textDecoration: "none", flex: 1 }}>
            <Box sx={{ color: palette.inkFaint, fontSize: "11px" }}>← prev</Box>
            <Box sx={{ fontFamily: fonts.mono }}>{shortName(prev.id)}</Box>
          </Box>
        )}
        {next && (
          <Box
            component={Link}
            to={`/${next.id}`}
            sx={{ color: palette.link, textDecoration: "none", flex: 1, textAlign: "right" }}
          >
            <Box sx={{ color: palette.inkFaint, fontSize: "11px" }}>next →</Box>
            <Box sx={{ fontFamily: fonts.mono }}>{shortName(next.id)}</Box>
          </Box>
        )}
      </Box>
    </>
  );
}

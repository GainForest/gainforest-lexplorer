import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import {
  typeLabel,
  constraintsLabel,
  valuesOf,
  refsOf,
  resolveRef,
  type FlatField,
} from "../data/lexicons";
import { palette, fonts } from "../theme";

interface Props {
  fields: FlatField[];
  /** id of the lexicon these fields belong to (for resolving local refs) */
  lexiconId: string;
}

const metaLine = {
  fontFamily: fonts.mono,
  fontSize: "10.5px",
  color: palette.inkFaint,
  mt: "3px",
  wordBreak: "break-word" as const,
};

export default function FieldTable({ fields, lexiconId }: Props) {
  if (!fields.length) return null;
  return (
    <Box
      sx={{
        mb: "28px",
        fontSize: "13px",
        borderTop: `1px solid ${palette.rule}`,
      }}
    >
      {fields.map((prop) => {
        const constraints = constraintsLabel(prop);
        const values = valuesOf(prop);
        const refs = refsOf(prop).map((r) => resolveRef(r, lexiconId));
        return (
          <Box
            key={prop.name}
            sx={{
              borderBottom: `1px solid ${palette.ruleSoft}`,
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { sm: "flex-start" },
              gap: { xs: "2px", sm: "12px" },
              py: "10px",
            }}
          >
            <Box
              sx={{
                fontFamily: fonts.mono,
                fontSize: "12.5px",
                color: palette.forest,
                flex: { sm: "0 0 200px" },
                overflowWrap: "anywhere",
              }}
            >
              {prop.name}
              {prop.required && (
                <Box component="span" sx={{ color: palette.warn, ml: "4px" }}>
                  *
                </Box>
              )}
            </Box>
            <Box sx={{ color: palette.inkSoft, flex: 1, minWidth: 0 }}>
              {prop.description ?? ""}

              <Box sx={metaLine}>
                {typeLabel(prop)}
                {constraints && (
                  <Box component="span" sx={{ color: palette.inkFaint }}>
                    {" · "}
                    {constraints}
                  </Box>
                )}
                {refs
                  .filter((r) => r.to)
                  .map((r, i) => (
                    <Box component="span" key={i}>
                      {" · "}
                      <Box
                        component={Link}
                        to={r.anchor ? `${r.to}#${r.anchor}` : r.to!}
                        sx={{ color: palette.moss, textDecoration: "none" }}
                      >
                        {r.label}
                      </Box>
                    </Box>
                  ))}
              </Box>

              {values && (
                <Box sx={metaLine}>
                  <Box component="strong" sx={{ fontWeight: 600 }}>
                    {"values: "}
                  </Box>
                  {values.join(", ")}
                </Box>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

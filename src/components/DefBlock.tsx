import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import FieldTable from "./FieldTable";
import { viewDef, resolveRef, type LexiconDef } from "../data/lexicons";
import { palette, fonts } from "../theme";

interface Props {
  name: string;
  def: LexiconDef;
  lexiconId: string;
  /** the primary def is rendered without the #name heading */
  primary?: boolean;
}

const KIND_LABEL: Record<string, string> = {
  record: "record",
  object: "object",
  query: "query",
  procedure: "procedure",
  subscription: "subscription",
  token: "token",
  string: "string",
  array: "array",
  union: "union",
  other: "def",
};

export default function DefBlock({ name, def, lexiconId, primary }: Props) {
  const view = viewDef(def);

  return (
    <Box id={name} sx={{ mb: "32px", scrollMarginTop: "24px" }}>
      {!primary && (
        <Box
          component="h4"
          sx={{
            fontFamily: fonts.mono,
            fontSize: "13px",
            fontWeight: 500,
            color: palette.inkSoft,
            m: "0 0 4px",
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
          }}
        >
          #{name}
          <Box component="span" sx={{ fontSize: "11px", color: palette.inkFaint }}>
            {KIND_LABEL[view.kind] ?? view.kind}
          </Box>
        </Box>
      )}

      {primary && (
        <Box
          sx={{
            fontFamily: fonts.mono,
            fontSize: "11px",
            color: palette.inkFaint,
            mb: "8px",
          }}
        >
          {KIND_LABEL[view.kind] ?? view.kind}
          {view.key && (
            <Box component="span">
              {" · key "}
              <Box component="span" sx={{ color: palette.moss }}>
                {view.key}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {view.description && (
        <Box sx={{ fontSize: "13.5px", color: palette.inkSoft, mb: "12px", maxWidth: 660 }}>
          {view.description}
        </Box>
      )}

      <FieldTable fields={view.fields} lexiconId={lexiconId} />

      {view.values && view.values.length > 0 && (
        <Box
          sx={{
            fontFamily: fonts.mono,
            fontSize: "12px",
            color: palette.inkSoft,
            borderTop: `1px solid ${palette.rule}`,
            pt: "10px",
            mb: "8px",
            wordBreak: "break-word",
          }}
        >
          <Box component="span" sx={{ color: palette.inkFaint }}>
            values:{" "}
          </Box>
          {view.values.join("  ·  ")}
        </Box>
      )}

      {view.refs && view.refs.length > 0 && (
        <Box
          sx={{
            fontFamily: fonts.mono,
            fontSize: "12px",
            borderTop: `1px solid ${palette.rule}`,
            pt: "10px",
            mb: "8px",
          }}
        >
          <Box component="span" sx={{ color: palette.inkFaint }}>
            members:{" "}
          </Box>
          {view.refs.map((r, i) => {
            const link = resolveRef(r, lexiconId);
            return (
              <Box component="span" key={r}>
                {i > 0 && "  ·  "}
                {link.to ? (
                  <Box
                    component={Link}
                    to={link.anchor ? `${link.to}#${link.anchor}` : link.to}
                    sx={{ color: palette.moss, textDecoration: "none" }}
                  >
                    {link.label}
                  </Box>
                ) : (
                  link.label
                )}
              </Box>
            );
          })}
        </Box>
      )}

      {view.outputFields && view.outputFields.length > 0 && (
        <Box sx={{ mt: "8px" }}>
          <Box
            component="div"
            sx={{
              fontFamily: fonts.mono,
              fontSize: "11px",
              color: palette.inkFaint,
              mb: "2px",
            }}
          >
            output
          </Box>
          <FieldTable fields={view.outputFields} lexiconId={lexiconId} />
        </Box>
      )}
    </Box>
  );
}

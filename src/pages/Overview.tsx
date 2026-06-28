import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import SchemaGraph from "../components/SchemaGraph";
import { GROUPS, LEXICONS, lexiconDescription } from "../data/lexicons";
import { palette, fonts } from "../theme";

const mono = { fontFamily: fonts.mono };

export default function Overview() {
  return (
    <>
      <Box
        component="p"
        sx={{ color: palette.inkSoft, fontSize: "15.5px", maxWidth: 660, m: 0, mb: "20px" }}
      >
        AT Protocol record schemas developed by{" "}
        <Box component="a" href="https://gainforest.net" target="_blank" rel="noopener" sx={{ color: palette.link }}>
          GainForest
        </Box>{" "}
        for environmental impact tracking, biodiversity data, and decentralized public goods — part
        of the{" "}
        <Box component="span" sx={{ color: palette.moss, fontStyle: "italic", fontFamily: fonts.serif }}>
          Hypersphere
        </Box>{" "}
        ecosystem.{" "}
        <Box component="span" sx={mono}>{LEXICONS.length}</Box> lexicons across{" "}
        <Box component="span" sx={mono}>{GROUPS.length}</Box> namespaces. Biodiversity records align
        with{" "}
        <Box component="a" href="https://dwc.tdwg.org/" target="_blank" rel="noopener" sx={{ color: palette.link }}>
          Darwin Core
        </Box>{" "}
        and{" "}
        <Box component="a" href="https://ac.tdwg.org/" target="_blank" rel="noopener" sx={{ color: palette.link }}>
          Audiovisual Core
        </Box>
        ; cross-record links use{" "}
        <Box component="span" sx={mono}>com.atproto.repo.strongRef</Box>.
      </Box>

      <Box sx={{ mb: "40px" }}>
        <SchemaGraph />
      </Box>

      {GROUPS.map((g) => (
        <Box key={g.ns} sx={{ mb: "32px" }}>
          <Box
            component="h2"
            sx={{
              fontFamily: fonts.serif,
              fontSize: { xs: "18px", sm: "21px" },
              fontWeight: 600,
              letterSpacing: "-0.005em",
              m: "0 0 2px",
              color: palette.ink,
              borderTop: `1px solid ${palette.rule}`,
              pt: "26px",
            }}
          >
            {g.title}
          </Box>
          <Box sx={{ ...mono, fontSize: "11px", color: palette.inkFaint, mb: "4px" }}>{g.ns}</Box>
          {g.blurb && (
            <Box sx={{ color: palette.inkSoft, fontSize: "13.5px", maxWidth: 660, mb: "14px" }}>
              {g.blurb}
            </Box>
          )}

          <Box sx={{ fontSize: "13.5px" }}>
            {g.lexicons.map((lex) => (
              <Box
                key={lex.id}
                sx={{
                  borderBottom: `1px solid ${palette.ruleSoft}`,
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { sm: "flex-start" },
                  gap: { xs: "4px", sm: "14px" },
                  py: "11px",
                }}
              >
                <Box
                  component={Link}
                  to={`/${lex.id}`}
                  sx={{
                    ...mono,
                    fontSize: "12.5px",
                    color: palette.link,
                    textDecoration: "none",
                    flex: { sm: "0 0 250px" },
                    overflowWrap: "anywhere",
                  }}
                >
                  {lex.id}
                </Box>
                <Box sx={{ color: palette.inkSoft, flex: 1 }}>{lexiconDescription(lex)}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </>
  );
}

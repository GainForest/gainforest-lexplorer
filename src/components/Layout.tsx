import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import HelixMark from "./HelixMark";
import { GROUPS, shortName } from "../data/lexicons";
import { palette, fonts } from "../theme";

const footerLinks = [
  { href: "https://atproto.com/", label: "AT Protocol" },
  { href: "https://dwc.tdwg.org/", label: "Darwin Core" },
  { href: "https://hypergoat.vercel.app", label: "Hypergoat" },
  { href: "https://impactindexer.org", label: "Impact Indexer" },
  { href: "https://github.com/GainForest", label: "GitHub" },
];

function Brand() {
  return (
    <Box
      component={Link}
      to="/"
      sx={{
        display: "inline-flex",
        alignItems: "baseline",
        lineHeight: 1,
        color: "inherit",
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      <Box component="span" sx={{ display: "inline-block", alignSelf: "center", mr: "6px" }}>
        <HelixMark />
      </Box>
      <Box
        component="span"
        sx={{ fontFamily: fonts.mono, fontSize: "14px", color: palette.ink, fontWeight: 500 }}
      >
        gainforest
      </Box>
      <Box
        component="span"
        sx={{
          fontFamily: fonts.serif,
          fontStyle: "italic",
          fontSize: "17px",
          color: palette.moss,
          fontWeight: 500,
          ml: "1px",
        }}
      >
        .lex
      </Box>
    </Box>
  );
}

function SideNav() {
  return (
    <Box component="nav" aria-label="Lexicon namespaces">
      <Box
        component={NavLink}
        to="/"
        end
        sx={{ display: "block", textDecoration: "none", mb: "18px" }}
        style={({ isActive }) =>
          ({
            color: isActive ? palette.ink : palette.inkSoft,
            fontWeight: isActive ? 600 : 400,
          }) as React.CSSProperties
        }
      >
        <Box sx={{ fontSize: "13px" }}>Overview</Box>
      </Box>

      {GROUPS.map((g) => (
        <Box key={g.ns} sx={{ mb: "16px" }}>
          <Box
            sx={{
              fontFamily: fonts.mono,
              fontSize: "10.5px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: palette.inkFaint,
              mb: "5px",
            }}
          >
            {g.title}
          </Box>
          {g.lexicons.map((lex) => (
            <NavLink
              key={lex.id}
              to={`/${lex.id}`}
              style={({ isActive }) =>
                ({
                  display: "block",
                  fontFamily: fonts.mono,
                  fontSize: "12px",
                  lineHeight: 1.9,
                  textDecoration: "none",
                  color: isActive ? palette.forest : palette.inkSoft,
                  fontWeight: isActive ? 600 : 400,
                  borderLeft: `2px solid ${isActive ? palette.moss : "transparent"}`,
                  paddingLeft: "8px",
                }) as React.CSSProperties
              }
            >
              {shortName(lex.id)}
            </NavLink>
          ))}
        </Box>
      ))}
    </Box>
  );
}

export default function Layout() {
  const location = useLocation();
  return (
    <>
      <Box
        component="nav"
        sx={{
          maxWidth: 1080,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: "30px",
          display: "flex",
          alignItems: "baseline",
          flexWrap: "wrap",
          rowGap: "10px",
          columnGap: { xs: "14px", sm: "20px" },
          fontSize: "13.5px",
          color: palette.inkSoft,
        }}
      >
        <Brand />
        <Box sx={{ flex: 1 }} />
        <Box
          component="span"
          sx={{ fontFamily: fonts.mono, fontSize: "11px", color: palette.inkFaint }}
        >
          v0.1
        </Box>
        <Box
          component="a"
          href="https://github.com/GainForest"
          target="_blank"
          rel="noopener"
          sx={{ color: palette.link, textDecoration: "none" }}
        >
          GitHub
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1080,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: "28px", sm: "40px" },
          display: "flex",
          alignItems: "flex-start",
          gap: { xs: 0, md: "44px" },
        }}
      >
        <Box
          component="aside"
          sx={{
            display: { xs: "none", md: "block" },
            flex: "0 0 200px",
            position: "sticky",
            top: "24px",
            maxHeight: "calc(100vh - 48px)",
            overflowY: "auto",
            pb: "32px",
          }}
        >
          <SideNav />
        </Box>

        <Box
          component="main"
          key={location.pathname}
          sx={{ flex: 1, minWidth: 0, maxWidth: 760, pb: "56px" }}
        >
          <Outlet />
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          maxWidth: 1080,
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          pt: 3,
          pb: 6,
          borderTop: `1px solid ${palette.rule}`,
          mt: 4,
          fontSize: "12.5px",
          color: palette.inkFaint,
          display: "flex",
          flexWrap: "wrap",
          rowGap: 1.5,
          columnGap: { xs: 2, sm: 3 },
          alignItems: "baseline",
        }}
      >
        {footerLinks.map(({ href, label }) => (
          <Box
            key={href}
            component="a"
            href={href}
            target="_blank"
            rel="noopener"
            sx={{ color: palette.link, textDecoration: "none" }}
          >
            {label}
          </Box>
        ))}
        <Box sx={{ flex: 1 }} />
        <Box component="span">part of the Hypersphere ecosystem</Box>
      </Box>
    </>
  );
}

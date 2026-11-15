import { Alert, Box, Button, Chip, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import StorefrontIcon from "@mui/icons-material/Storefront";
import CloudIcon from "@mui/icons-material/Cloud";
import DnsIcon from "@mui/icons-material/Dns";
import StorageIcon from "@mui/icons-material/Storage";
import LockIcon from "@mui/icons-material/Lock";
import { useAppContext } from "../hooks/useAppContext";
import { SOCIAL_LINKS } from "../components/ui/SocialLinks";

const features = [
  "Browse products by main category and sub-category, or see everything at once",
  "Sort product lists and open a quick-view or a full product page",
  "Add items to the cart and keep a favourites list",
  "Sign in with Google to keep your cart, favourites and recently viewed items",
  "Fully responsive layout that works on phone, tablet and desktop",
];

const architecture = [
  {
    Icon: StorefrontIcon,
    title: "Frontend",
    host: "Vercel",
    text: "A React 19 + TypeScript single-page app built with Vite and Material UI. Vercel builds and serves it from its global edge network on every push.",
  },
  {
    Icon: DnsIcon,
    title: "Backend API",
    host: "Render",
    text: "A NestJS REST API that serves the product catalogue and per-user data. It runs on Render's free tier, so the first request after a quiet period may take ~30 seconds to wake up.",
  },
  {
    Icon: StorageIcon,
    title: "Database",
    host: "Supabase",
    text: "Products, categories and user data (cart, favourites, recently viewed) live in a managed cloud database.",
  },
  {
    Icon: LockIcon,
    title: "Authentication",
    host: "AWS Cognito",
    text: "Sign-in with Google OAuth via AWS Amplify. The API verifies each user's JWT before touching their data.",
  },
];

const stack = [
  "React 19",
  "TypeScript",
  "Vite",
  "Material UI",
  "React Router",
  "NestJS",
  "Node.js",
  "Supabase",
  "AWS Cognito",
  "AWS Amplify",
  "Vercel",
  "Render",
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
      {children}
    </Typography>
  );
}

export default function About() {
  const location = useLocation();
  const { dbOnline } = useAppContext();
  const fromCheckout = (location.state as { fromCheckout?: boolean } | null)
    ?.fromCheckout;

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: { xs: 4, md: 6 }, maxWidth: 900, mx: "auto" }}>
      {fromCheckout && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Heads up — MyShop isn't a real e-commerce store. It's a personal
          portfolio project, so no orders are processed and nothing is charged.
        </Alert>
      )}

      {dbOnline === false && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          The product API isn't responding right now. It runs on a free hosting
          tier that sleeps when idle, so give it a few seconds and refresh.
        </Alert>
      )}

      {/* Intro */}
      <Typography
        variant="overline"
        sx={{ color: "secondary.main", fontWeight: 600, letterSpacing: 2 }}
      >
        About this project
      </Typography>
      <Typography
        variant="h3"
        component="h1"
        sx={{ fontWeight: 700, mb: 2, fontSize: { xs: "2rem", md: "2.75rem" } }}
      >
        MyShop
      </Typography>
      <Typography sx={{ mb: 2, lineHeight: 1.8, fontSize: "1.1rem" }}>
        MyShop is a full-stack e-commerce web app I built as a portfolio
        project. It covers the whole path of a real online store — a product
        catalogue, cart, favourites and Google sign-in — from the UI down to
        the API, the database and the cloud hosting behind it.
      </Typography>
      <Typography sx={{ mb: 4, lineHeight: 1.8, color: "text.secondary" }}>
        It's not a real store: nothing is sold and no payments are taken. It's
        here to show how I design, build and deploy a production-style
        application end to end.
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 6 }}>
        {SOCIAL_LINKS.map(({ label, href, Icon }) => (
          <Button
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            variant={label === "Portfolio" ? "contained" : "outlined"}
            startIcon={<Icon />}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {label}
          </Button>
        ))}
      </Box>

      {/* Features */}
      <Box sx={{ mb: 6 }}>
        <SectionTitle>What you can do</SectionTitle>
        <Box component="ul" sx={{ pl: 3, m: 0 }}>
          {features.map((f) => (
            <Typography component="li" key={f} sx={{ mb: 1, lineHeight: 1.7 }}>
              {f}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Architecture */}
      <Box sx={{ mb: 6 }}>
        <SectionTitle>How it's built</SectionTitle>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 2,
          }}
        >
          {architecture.map(({ Icon, title, host, text }) => (
            <Paper
              key={title}
              variant="outlined"
              sx={{ p: 3, borderRadius: 2, height: "100%" }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1,
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                    {title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {host}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {text}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      {/* Stack */}
      <Box sx={{ mb: 6 }}>
        <SectionTitle>Tech stack</SectionTitle>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {stack.map((s) => (
            <Chip key={s} label={s} variant="outlined" sx={{ borderRadius: 1 }} />
          ))}
        </Box>
      </Box>

      {/* Note */}
      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderRadius: 2,
          display: "flex",
          gap: 2,
          alignItems: "flex-start",
          bgcolor: "background.default",
        }}
      >
        <CloudIcon sx={{ color: "secondary.main", mt: 0.25 }} />
        <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
          Everything runs on free hosting tiers. If products take a moment to
          appear, the API is just waking up — refresh after a few seconds.
        </Typography>
      </Paper>
    </Box>
  );
}

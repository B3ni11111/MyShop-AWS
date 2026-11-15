import { Box, IconButton, Tooltip } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import LanguageIcon from "@mui/icons-material/Language";
import CodeIcon from "@mui/icons-material/Code";
import type { SvgIconComponent } from "@mui/icons-material";

export interface SocialLink {
  label: string;
  href: string;
  Icon: SvgIconComponent;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/bennybar1/",
    Icon: LinkedInIcon,
  },
  { label: "GitHub", href: "https://github.com/B3ni11111", Icon: GitHubIcon },
  { label: "Portfolio", href: "https://bennybar.dev/", Icon: LanguageIcon },
  {
    label: "Source code",
    href: "https://github.com/B3ni11111/MyShop-AWS",
    Icon: CodeIcon,
  },
];

/** Compact row of icon links, used in the footer. */
export default function SocialLinks({ color = "inherit" }: { color?: string }) {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {SOCIAL_LINKS.map(({ label, href, Icon }) => (
        <Tooltip key={label} title={label}>
          <IconButton
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            sx={{ color, "&:hover": { bgcolor: "rgba(255,255,255,0.08)" } }}
          >
            <Icon />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}

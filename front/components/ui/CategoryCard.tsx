import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  name: string;
  img: string;
  link: string;
  compact?: boolean;
}

export default function CategoryCard({
  name,
  img,
  link,
  compact = false,
}: CategoryCardProps) {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Card
        sx={{
          borderRadius: 2,
          cursor: "pointer",
          width: "100%",
          maxWidth: compact
            ? { xs: 120, sm: 150, md: 180 }
            : { xs: 200, sm: 240, md: 280 },
          height: "100%",
          mx: "auto",
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            p: compact ? 1.5 : 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: compact
                ? { xs: "80px", sm: "100px", md: "120px" }
                : { xs: "140px", sm: "170px", md: "200px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1,
              bgcolor: "#ffffff",
              borderRadius: 1,
            }}
          >
            {img && (
              <img
                src={img}
                alt={name}
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  width: "auto",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            )}
          </Box>
          <Typography
            variant={compact ? "body1" : "h6"}
            sx={{
              mt: 1,
              minHeight: compact ? "2.5em" : "3em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              wordWrap: "break-word",
              fontWeight: compact ? 500 : undefined,
            }}
          >
            {name}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}

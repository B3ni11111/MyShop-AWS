import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography, Breadcrumbs, CircularProgress } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useParams, Link } from "react-router-dom";
import CategoryCard from "../components/ui/CategoryCard";
import NotFound from "./NotFound";
import type { itemsDataInterface } from "../types";
import { API_ENDPOINTS } from "../config/api";
import { useAppContext } from "../hooks/useAppContext";

export default function SubCategory() {
  const { reportDbStatus } = useAppContext();
  const { mainCat } = useParams<{ mainCat: string }>();
  const [data, setData] = useState<itemsDataInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.itemsFull)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        setData(data);
        reportDbStatus(true);
      })
      .catch(() => reportDbStatus(false))
      .finally(() => setLoading(false));
  }, [reportDbStatus]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const categoryEntry = data.find((entry) => entry.category.path === mainCat);

  if (!categoryEntry) {
    return <NotFound />;
  }

  const { category } = categoryEntry;

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        p: 2,
        minHeight: "100vh",
        maxWidth: 1400,
        mx: "auto",
      }}
    >
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        sx={{ mb: 3 }}
      >
        <Typography
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          Home
        </Typography>
        <Typography color="text.primary">{category.categoryName}</Typography>
      </Breadcrumbs>

      <Typography variant="h4" sx={{ mb: 3 }}>
        {category.categoryName}
      </Typography>

      <Grid container spacing={1.5} justifyContent="center">
        {category.subCategory.map((sub) => (
          <Grid
            key={sub.path}
            size={{ xs: 6, sm: 6, md: 4, lg: 3, xl: 3 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <CategoryCard
              name={sub.name}
              img={sub.img}
              link={`/shop/${category.path}/${sub.path}`}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

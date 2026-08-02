import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography, Breadcrumbs, CircularProgress } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import BetterItem from "../components/ui/BetterItem";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../hooks/useAppContext";
import Sorted from "../components/ui/SortMui";
import type { itemsDataInterface } from "../types";
import { API_ENDPOINTS } from "../config/api";

export default function ShopItems() {
  const { sort, reportDbStatus } = useAppContext();
  const { mainCat, subCat } = useParams<{ mainCat: string; subCat: string }>();
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

  const categoryEntry = data.find((entry) => entry.category.path === mainCat);
  const subCategory = categoryEntry?.category.subCategory.find(
    (sub) => sub.path.toLowerCase() === subCat?.toLowerCase(),
  );

  const isAll = subCat?.toLowerCase() === "all";

  const filteredItems = useMemo(() => {
    if (!categoryEntry) return [];

    let items = isAll
      ? categoryEntry.category.subCategory.flatMap((sub) => sub.items)
      : subCategory?.items || [];

    if (sort === "lowToHigh") {
      items = [...items].sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      items = [...items].sort((a, b) => b.price - a.price);
    }

    return items;
  }, [categoryEntry, subCategory, isAll, sort]);

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
        <Typography
          component={Link}
          to={`/shop/${mainCat}`}
          sx={{
            textDecoration: "none",
            color: "text.secondary",
            "&:hover": { color: "text.primary" },
          }}
        >
          {categoryEntry?.category.categoryName}
        </Typography>
        <Typography color="text.primary">
          {isAll ? "All" : subCategory?.name}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">
          {isAll ? "All" : subCategory?.name}
        </Typography>
        {filteredItems.length !== 0 && <Sorted />}
      </Box>

      <Grid container spacing={1.5} justifyContent="center">
        {filteredItems.map((item) => (
          <Grid
            key={item.id}
            size={{ xs: 6, sm: 6, md: 4, lg: 3, xl: 3 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <BetterItem i={item} />
          </Grid>
        ))}
      </Grid>

      {filteredItems.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          No Items in this category yet... Press here to{" "}
          {<Link to={"/"}>return home</Link>}
        </Typography>
      )}
    </Box>
  );
}

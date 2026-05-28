import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CategoryCard from "../components/ui/CategoryCard";
import { Link } from "react-router-dom";
import { Typography, Button, CircularProgress } from "@mui/material";
import BetterItem from "../components/ui/BetterItem";
import type { itemsDataInterface } from "../types";
import { API_ENDPOINTS } from "../config/api";
import { fetchUserAttributes } from "aws-amplify/auth";

export default function Home() {
  const [data, setData] = useState<itemsDataInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    fetch(API_ENDPOINTS.itemsFull)
      .then((res) => res.json())
      .then((data) => setData(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchUserAttributes()
      .then((attrs) => {
        console.log("fetchUserAttributes result:", attrs);
        setUsername(attrs.name ?? attrs.email ?? "");
      })
      .catch(() => setUsername(""));
  }, []);

  const allItems = data.flatMap((entry) =>
    entry.category.subCategory.flatMap((sub) => sub.items),
  );

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
      <Typography variant="h4" sx={{ mb: 3 }}>
        {username ? `Welcome, ${username}!` : "Welcome"}
      </Typography>

      <Typography variant="h5" sx={{ mb: 2 }}>
        Categories
      </Typography>
      <Grid container spacing={1.5} justifyContent="center" sx={{ mb: 4 }}>
        {data.map((entry) => (
          <Grid
            key={entry.category.categoryName}
            size={{ xs: 4, sm: 4, md: 3, lg: 2 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <CategoryCard
              name={entry.category.categoryName}
              img={entry.category.categoryImg}
              link={`shop/${entry.category.path}`}
              compact
            />
          </Grid>
        ))}
      </Grid>

      {/* All Products Section */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="h5">Products</Typography>
        <Link to={"shop/all-items"} style={{ textDecoration: "none" }}>
          <Button variant="outlined" size="small">
            View All
          </Button>
        </Link>
      </Box>
      <Grid container spacing={1} justifyContent="center">
        {allItems.map((item) => (
          <Grid
            key={item.id}
            size={{ xs: 4, sm: 3, md: 2, lg: 2 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <BetterItem i={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

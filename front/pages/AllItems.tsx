import { useState, useEffect, useMemo } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { CircularProgress } from "@mui/material";
import BetterItem from "../components/ui/BetterItem";
import { useAppContext } from "../hooks/useAppContext";
import Sorted from "../components/ui/SortMui";
import type { oneItemInterface } from "../types";
import { API_ENDPOINTS } from "../config/api";

export default function AllItems() {
  const { sort, reportDbStatus } = useAppContext();
  const [items, setItems] = useState<oneItemInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_ENDPOINTS.items)
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => {
        setItems(data);
        reportDbStatus(true);
      })
      .catch(() => reportDbStatus(false))
      .finally(() => setLoading(false));
  }, [reportDbStatus]);

  const sortedItems = useMemo(() => {
    if (sort === "lowToHigh") {
      return [...items].sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      return [...items].sort((a, b) => b.price - a.price);
    }
    return items;
  }, [sort, items]);

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
      <Sorted />
      <Grid container spacing={1.5} justifyContent="center">
        {sortedItems.map((item) => (
          <Grid
            key={item.id}
            size={{ xs: 6, sm: 6, md: 4, lg: 3, xl: 3 }}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <BetterItem i={item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

import { useState, useEffect } from "react";
import { Box, Card, Typography, IconButton, CircularProgress } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useAppContext } from "../hooks/useAppContext";
import { getFavorites, removeFavorite } from "../services/usersApi";
import type { oneItemInterface } from "../types";
import { itemsData as staticItemsData } from "../data/itemsData";

const flattenedItems: oneItemInterface[] = staticItemsData.flatMap((entry) =>
  entry.category.subCategory.flatMap((sub) => sub.items)
);

export default function Fav() {
    const { fav, toggleFav, addToCart } = useAppContext();
    const [loading, setLoading] = useState(true);
    const [apiFavorites, setApiFavorites] = useState<oneItemInterface[]>([]);

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const { favorites } = await getFavorites();
                const favItems = favorites
                    .map((productId) => flattenedItems.find((p) => String(p.id) === productId))
                    .filter((item): item is oneItemInterface => item !== undefined);
                setApiFavorites(favItems);
            } catch (err) {
                // User not authenticated, use context favorites
                console.error("Failed to load favorites from API:", err);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    const handleRemoveFavorite = async (item: oneItemInterface) => {
        // Update local state via context
        toggleFav(item);

        // Also update local API favorites state
        setApiFavorites((prev) => prev.filter((f) => f.id !== item.id));

        // API call is handled by toggleFav in context
        try {
            await removeFavorite(String(item.id));
        } catch (err) {
            console.error("Failed to remove favorite from API:", err);
        }
    };

    // Use API favorites if available, otherwise use context
    const displayFavorites = apiFavorites.length > 0 ? apiFavorites : fav;

    if (loading) {
        return (
            <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, textAlign: "center" }}>
                <CircularProgress />
            </Box>
        );
    }

    if (displayFavorites.length === 0) {
        return (
            <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
                <Typography variant="h4">No Favorites Yet</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", p: 2 }}>
            <Typography variant="h3" sx={{ mb: 3 }}>
                Favorites
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {displayFavorites.map((item) => (
                    <Card
                        key={item.id}
                        sx={{
                            display: "flex",
                            p: 2,
                            gap: 2,
                        }}
                    >
                        <img
                            src={item.img}
                            alt={item.product}
                            style={{
                                maxWidth: "100px",
                                maxHeight: "100px",
                                width: "auto",
                                height: "auto",
                                objectFit: "contain",
                            }}
                        />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ mb: 1 }}>
                                {item.product}
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                {item.info}
                            </Typography>
                            <Typography variant="h6" sx={{ color: "text.secondary" }}>
                                ₪ {item.price}
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                                onClick={() => addToCart(item)}
                                sx={{ color: "primary.main" }}
                            >
                                <AddShoppingCartIcon />
                            </IconButton>
                            <IconButton
                                onClick={() => handleRemoveFavorite(item)}
                                sx={{ color: "error.main" }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Card>
                ))}
            </Box>
        </Box>
    );
}

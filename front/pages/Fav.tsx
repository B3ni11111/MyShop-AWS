import { Box, Card, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useAppContext } from "../hooks/useAppContext";

export default function Fav() {
    const { fav, toggleFav, addToCart } = useAppContext();

    if (fav.length === 0) {
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
                {fav.map((item) => (
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
                                onClick={() => toggleFav(item)}
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

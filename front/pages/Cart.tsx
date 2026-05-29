import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { Box, Card, Typography, IconButton, CircularProgress } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAppContext } from "../hooks/useAppContext";
import LaunchIcon from "@mui/icons-material/Launch";
import { Link } from "react-router-dom";
import { getCart, addToCart as apiAddToCart, removeFromCart as apiRemoveFromCart } from "../services/usersApi";
import type { CartItem } from "../types";
import { itemsData as staticItemsData } from "../data/itemsData";
import type { oneItemInterface } from "../types";

const flattenedItems: oneItemInterface[] = staticItemsData.flatMap((entry) =>
  entry.category.subCategory.flatMap((sub) => sub.items)
);

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, resetCart } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [apiCart, setApiCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const { cart: cartData } = await getCart();
        const cartItems: CartItem[] = cartData.map((item) => {
          const product = flattenedItems.find((p) => String(p.id) === item.productId);
          return {
            id: item.productId,
            product: product?.product || "Unknown",
            price: item.price,
            img: product?.img || "",
            info: product?.info || "",
            quantity: item.qty,
          };
        });
        setApiCart(cartItems);
      } catch (err) {
        console.error("Failed to load cart from API:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleUpdateQuantity = async (item: CartItem, newQty: number) => {
    // Update context (handles local state)
    updateQuantity(item.id, newQty);

    // Update local API cart state
    if (newQty <= 0) {
      setApiCart((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setApiCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i))
      );
    }

    // Sync with API
    try {
      if (newQty <= 0) {
        await apiRemoveFromCart(String(item.id));
      } else {
        await apiAddToCart(String(item.id), newQty, item.price);
      }
    } catch (err) {
      console.error("Failed to update cart in API:", err);
    }
  };

  const handleRemoveFromCart = async (itemId: number | string) => {
    // Update context
    removeFromCart(itemId);

    // Update local API cart state
    setApiCart((prev) => prev.filter((i) => i.id !== itemId));

    // Sync with API
    try {
      await apiRemoveFromCart(String(itemId));
    } catch (err) {
      console.error("Failed to remove from cart in API:", err);
    }
  };

  const handleResetCart = async () => {
    const currentCart = displayCart;
    resetCart();
    setApiCart([]);

    // Remove all from API
    try {
      await Promise.all(currentCart.map((item) => apiRemoveFromCart(String(item.id))));
    } catch (err) {
      console.error("Failed to reset cart in API:", err);
    }
  };

  // Use API cart if available, otherwise use context
  const displayCart = apiCart.length > 0 ? apiCart : cart;

  const getTotalPrice = () => {
    return displayCart.reduce((total, i) => total + i.price * i.quantity, 0);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (displayCart.length === 0) {
    return (
      <Box sx={{ bgcolor: "background.paper", p: 3, borderRadius: 2 }}>
        <Typography variant="h4">Your Cart is Empty</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography variant="h3">Shopping Cart</Typography>
        <Button onClick={handleResetCart} variant="contained" color="error">
          Reset Cart
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {displayCart.map((i) => (
          <Card
            key={i.id}
            sx={{
              display: "flex",
              p: 2,
              gap: 2,
            }}
          >
            <img
              src={i.img}
              alt={i.product}
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
                {i.product}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                ₪{i.price}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <IconButton component={Link} to={`/item-page/${i.id}`}>
                  <LaunchIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleUpdateQuantity(i, i.quantity - 1)}
                  sx={{ bgcolor: "background.default" }}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography
                  variant="body1"
                  sx={{
                    minWidth: "30px",
                    textAlign: "center",
                  }}
                >
                  {i.quantity}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => handleUpdateQuantity(i, i.quantity + 1)}
                  sx={{ bgcolor: "background.default" }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFromCart(i.id)}
                  sx={{ color: "error.main", ml: 2 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
              <Typography variant="h6">
                ₪{(i.price * i.quantity).toFixed(2)}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>
      <Card sx={{ mt: 3, p: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">
            Total: ₪{getTotalPrice().toFixed(2)}
          </Typography>
          <Link to={"/checkout"}>
            <Button color="success" variant="contained">
              checkout
            </Button>
          </Link>
        </Box>
      </Card>
    </Box>
  );
}

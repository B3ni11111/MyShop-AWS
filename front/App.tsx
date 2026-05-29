import { useMemo, useState, useEffect, useCallback } from "react";
import "./styles/App.css";
import "./assets/fonts/fonts.css";
import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, Snackbar, Alert } from "@mui/material";
import theme from "./config/theme";
import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { AppContext } from "./context/AppContext";
import type { AppContextType, oneItemInterface, CartItem, SortOption } from "./types";
import { itemsData as staticItemsData } from "./data/itemsData";
import { getCurrentUser } from "aws-amplify/auth";
import {
  getCart as apiGetCart,
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  getFavorites as apiFavorites,
  addToFavorite as apiAddFavorite,
  removeFavorite as apiRemoveFavorite,
} from "./services/usersApi";

const flattenedItems: oneItemInterface[] = staticItemsData.flatMap((entry) =>
  entry.category.subCategory.flatMap((sub) => sub.items)
);

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [fav, setFav] = useState<oneItemInterface[]>(() => {
    const saved = localStorage.getItem("fav");
    return saved ? JSON.parse(saved) : [];
  });
  const [sort, setSort] = useState<SortOption>("recommended");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const showAuthMessage = useCallback((message: string) => {
    setAuthMessage(message);
  }, []);

  // Check auth status and load data from API
  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        await getCurrentUser();
        setIsAuthenticated(true);

        // Load cart from API
        try {
          const { cart: apiCart } = await apiGetCart();
          if (apiCart.length > 0) {
            const cartItems: CartItem[] = apiCart
              .map((item) => {
                const product = flattenedItems.find((p) => String(p.id) === item.productId);
                if (!product) return null; // Filter out items with no matching product
                return {
                  id: item.productId,
                  product: product.product,
                  price: item.price,
                  img: product.img,
                  info: product.info,
                  quantity: item.qty,
                };
              })
              .filter((item): item is CartItem => item !== null);
            setCart(cartItems);
          }
        } catch (err) {
          console.error("Failed to load cart from API:", err);
        }

        // Load favorites from API
        try {
          const { favorites } = await apiFavorites();
          if (favorites.length > 0) {
            const favItems: oneItemInterface[] = favorites
              .map((productId) => flattenedItems.find((p) => String(p.id) === productId))
              .filter((item): item is oneItemInterface => item !== undefined);
            setFav(favItems);
          }
        } catch (err) {
          console.error("Failed to load favorites from API:", err);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };

    checkAuthAndLoadData();
  }, []);

  const addToCart = useCallback(async (item: oneItemInterface) => {
    if (!isAuthenticated) {
      showAuthMessage("Please sign in to add items to cart");
      return;
    }

    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    const newQty = existingItem ? existingItem.quantity + 1 : 1;

    // Update local state immediately
    setCart((prevCart) => {
      const isExist = prevCart.find((cartItem) => cartItem.id === item.id);
      if (isExist) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });

    // Sync with API
    try {
      await apiAddToCart(String(item.id), newQty, item.price);
    } catch (err) {
      console.error("Failed to sync cart with API:", err);
    }
  }, [cart, isAuthenticated, showAuthMessage]);

  const toggleFav = useCallback(async (item: oneItemInterface) => {
    if (!isAuthenticated) {
      showAuthMessage("Please sign in to add items to favorites");
      return;
    }

    const isFav = fav.find((favItem) => favItem.id === item.id);

    // Update local state immediately
    setFav((prevArr) => {
      if (isFav) {
        return prevArr.filter((favItem) => favItem.id !== item.id);
      }
      return [...prevArr, item];
    });

    // Sync with API
    try {
      if (isFav) {
        await apiRemoveFavorite(String(item.id));
      } else {
        await apiAddFavorite(String(item.id));
      }
    } catch (err) {
      console.error("Failed to sync favorites with API:", err);
    }
  }, [fav, isAuthenticated, showAuthMessage]);

  const removeFromCart = useCallback(async (itemId: number | string) => {
    // Update local state immediately
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));

    // Sync with API if authenticated
    if (isAuthenticated) {
      try {
        await apiRemoveFromCart(String(itemId));
      } catch (err) {
        console.error("Failed to sync cart removal with API:", err);
      }
    }
  }, [isAuthenticated]);

  const resetCart = useCallback(async () => {
    const currentCart = cart;
    setCart([]);

    // Remove all items from API if authenticated
    if (isAuthenticated) {
      try {
        await Promise.all(currentCart.map((item) => apiRemoveFromCart(String(item.id))));
      } catch (err) {
        console.error("Failed to reset cart in API:", err);
      }
    }
  }, [cart, isAuthenticated]);

  const updateQuantity = useCallback(async (id: number | string, newQ: number) => {
    if (newQ <= 0) {
      removeFromCart(id);
      return;
    }

    const item = cart.find((i) => i.id === id);

    // Update local state immediately
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: newQ } : item,
      ),
    );

    // Sync with API if authenticated
    if (isAuthenticated && item) {
      try {
        await apiAddToCart(String(id), newQ, item.price);
      } catch (err) {
        console.error("Failed to sync quantity with API:", err);
      }
    }
  }, [cart, isAuthenticated, removeFromCart]);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const sortedItems = useMemo(() => {
    if (sort === "recommended") {
      return flattenedItems;
    }

    if (sort === "lowToHigh") {
      return [...flattenedItems].sort((a, b) => a.price - b.price);
    }

    if (sort === "highToLow") {
      return [...flattenedItems].sort((a, b) => b.price - a.price);
    }

    return flattenedItems;
  }, [sort]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("fav", JSON.stringify(fav));
  }, [fav]);

  const appData: AppContextType = {
    itemsData: sortedItems,
    sort,
    setSort,
    cart,
    fav,
    isAuthenticated,
    addToCart,
    toggleFav,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    resetCart,
    showAuthMessage,
  };

  return (
    <AppContext.Provider value={appData}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header cartCount={getTotalItems()} />

          <Box component="main" sx={{ flex: 1 }}>
            <Outlet />
          </Box>

          <Footer />
        </Box>
        <Snackbar
          open={!!authMessage}
          autoHideDuration={4000}
          onClose={() => setAuthMessage(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setAuthMessage(null)}
            severity="warning"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {authMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;

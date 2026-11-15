import { useMemo, useState, useEffect, useCallback } from "react";
import "./styles/App.css";
import "./assets/fonts/fonts.css";
import { ThemeProvider } from "@emotion/react";
import { Box, CssBaseline, Snackbar, Alert } from "@mui/material";
import theme from "./config/theme";
import { Outlet } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import { AppContext } from "./context/AppContext";
import type { AppContextType, oneItemInterface, CartItem, SortOption } from "./types";
import { itemsData as staticItemsData } from "./data/itemsData";

const flattenedItems: oneItemInterface[] = staticItemsData.flatMap((entry) =>
  entry.category.subCategory.flatMap((sub) => sub.items)
);

// Cart and favourites are kept per visitor in the browser (no accounts).
function loadSaved<T>(key: string): T[] {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode etc.) — state still works in memory.
  }
}

function App() {
  const [cart, setCart] = useState<CartItem[]>(() => loadSaved<CartItem>("cart"));
  const [fav, setFav] = useState<oneItemInterface[]>(() => loadSaved<oneItemInterface>("fav"));
  const [sort, setSort] = useState<SortOption>("recommended");
  const [dbOnline, setDbOnline] = useState<boolean | null>(null);
  const [showDbMessage, setShowDbMessage] = useState(false);

  const reportDbStatus = useCallback((online: boolean) => {
    setDbOnline((prev) => {
      if (prev === false && online === false) return prev;
      if (online === false) setShowDbMessage(true);
      return online;
    });
  }, []);

  const addToCart = useCallback((item: oneItemInterface) => {
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
  }, []);

  const toggleFav = useCallback((item: oneItemInterface) => {
    setFav((prevArr) =>
      prevArr.some((favItem) => favItem.id === item.id)
        ? prevArr.filter((favItem) => favItem.id !== item.id)
        : [...prevArr, item],
    );
  }, []);

  const removeFromCart = useCallback((itemId: number | string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const resetCart = useCallback(() => setCart([]), []);

  const updateQuantity = useCallback(
    (id: number | string, newQ: number) => {
      if (newQ <= 0) {
        removeFromCart(id);
        return;
      }
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity: newQ } : item)),
      );
    },
    [removeFromCart],
  );

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const sortedItems = useMemo(() => {
    if (sort === "lowToHigh") {
      return [...flattenedItems].sort((a, b) => a.price - b.price);
    }
    if (sort === "highToLow") {
      return [...flattenedItems].sort((a, b) => b.price - a.price);
    }
    return flattenedItems;
  }, [sort]);

  useEffect(() => save("cart", cart), [cart]);
  useEffect(() => save("fav", fav), [fav]);

  const appData: AppContextType = {
    itemsData: sortedItems,
    sort,
    setSort,
    cart,
    fav,
    addToCart,
    toggleFav,
    removeFromCart,
    updateQuantity,
    getTotalItems,
    resetCart,
    dbOnline,
    reportDbStatus,
  };

  return (
    <AppContext.Provider value={appData}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ScrollToTop />
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
          open={showDbMessage}
          autoHideDuration={8000}
          onClose={() => setShowDbMessage(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setShowDbMessage(false)}
            severity="info"
            variant="filled"
            sx={{ width: "100%" }}
          >
            The product API isn't responding right now. This portfolio project
            runs on free hosting that sleeps when idle — give it a few seconds
            and refresh.
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;

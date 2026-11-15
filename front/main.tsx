import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";
import App from "./App";
import ShopItems from "./pages/ShopItems";
import ItemPage from "./pages/ItemPage";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Fav from "./pages/Fav";
import SubCat from "./pages/SubCat";
import NotFound from "./pages/NotFound";
import AllItems from "./pages/AllItems";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      // { index: true, element: <AllItems /> },
      { path: "shop/:mainCat", element: <SubCat /> },
      { path: "shop/:mainCat/:subCat", element: <ShopItems /> },
      { path: "item-page/:id", element: <ItemPage /> },
      { path: "shop/all-items", element: <AllItems /> },
      { path: "cart", element: <Cart /> },
      { path: "about", element: <About /> },
      { path: "fav", element: <Fav /> },
      // { path: "checkout", element: <Checkout /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

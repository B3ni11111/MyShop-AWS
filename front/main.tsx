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
import { Amplify } from 'aws-amplify';
import outputs from './amplify_outputs.json';

// OAuth redirects must match the origin the app is actually served from
// (CloudFront, Amplify Hosting, or localhost). Pin them to the current origin
// at runtime so Amplify always selects a matching redirect URI regardless of
// which domain serves the app. All these origins are registered as allowed
// callback/sign-out URLs on the Cognito app client.
const currentOrigin = `${window.location.origin}/`;
Amplify.configure({
  ...outputs,
  auth: {
    ...outputs.auth,
    oauth: {
      ...outputs.auth.oauth,
      redirect_sign_in_uri: [currentOrigin],
      redirect_sign_out_uri: [currentOrigin],
    },
  },
} as typeof outputs);

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

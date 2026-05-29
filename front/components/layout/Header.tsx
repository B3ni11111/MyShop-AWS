import { useState, useEffect, MouseEvent } from "react";
import AppBar from "@mui/material/AppBar";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { signInWithRedirect, getCurrentUser, signOut } from "aws-amplify/auth";
import { useAppContext } from "../../hooks/useAppContext";
import logo from "../../assets/images/logo.jpg";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [anchorElCart, setAnchorElCart] = useState<HTMLElement | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const { cart, updateQuantity, removeFromCart } = useAppContext();

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCartMouseEnter = (event: MouseEvent<HTMLElement>) => {
    setAnchorElCart(event.currentTarget);
  };

  const handleCartMouseLeave = () => {
    setAnchorElCart(null);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return (
    <AppBar
      position="sticky"
      sx={{ top: 0, mb: 1, bgcolor: "#172029", zIndex: 1100 }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ minHeight: { xs: 56, md: 60 }, position: "relative" }}
        >
          <Link to={"/"}>
            <img
              src={logo}
              alt="Benny's Shop"
              style={{ height: 48, width: "auto", display: "block" }}
            />
          </Link>
          <Tooltip title="Home">
            <Typography
              component={Link}
              to={"/"}
              sx={{
                textAlign: "center",
                pl: 2,
                textDecoration: "none",
                color: "white",
              }}
            >
              Home
            </Typography>
          </Tooltip>
          <Tooltip title="About">
            <Typography
              component={Link}
              to={"about"}
              sx={{
                textAlign: "center",
                pl: 2,
                textDecoration: "none",
                color: "white",
                mr: 1,
              }}
            >
              About
            </Typography>
          </Tooltip>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            ></Menu>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}></Box>

          <Box
            sx={{ flexGrow: 0, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Link to={"fav"}>
              <Tooltip title="Favorites">
                <IconButton>
                  <FavoriteIcon sx={{ color: "white" }} />
                </IconButton>
              </Tooltip>
            </Link>
            <Box
              onMouseEnter={handleCartMouseEnter}
              onMouseLeave={handleCartMouseLeave}
              sx={{ display: "inline-block" }}
            >
              <Link to="/cart">
                <Tooltip title="Shopping Cart">
                  <IconButton>
                    <Badge badgeContent={cartCount} color="error">
                      <ShoppingCartIcon sx={{ color: "white" }} />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Link>
              <Popover
                open={Boolean(anchorElCart)}
                anchorEl={anchorElCart}
                onClose={handleCartMouseLeave}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                sx={{ mt: 1, pointerEvents: "none" }}
                disableRestoreFocus
              >
                <Box
                  sx={{
                    width: 320,
                    maxHeight: 400,
                    overflow: "auto",
                    pointerEvents: "auto",
                  }}
                  onMouseEnter={() => setAnchorElCart(anchorElCart)}
                  onMouseLeave={handleCartMouseLeave}
                >
                  {cart.length === 0 ? (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography color="text.secondary">
                        Your cart is empty
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Box sx={{ p: 2 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Cart ({cartCount} items)
                        </Typography>
                      </Box>
                      <Divider />
                      {cart.map((item) => (
                        <Box key={item.id}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1.5,
                              gap: 1.5,
                            }}
                          >
                            <Box
                              component="img"
                              src={item.img}
                              alt={item.product}
                              sx={{
                                width: 50,
                                height: 50,
                                objectFit: "cover",
                                borderRadius: 1,
                                flexShrink: 0,
                              }}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: 500,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {item.product}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                ₪{item.price.toFixed(2)}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                  mt: 0.5,
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  sx={{ p: 0.25 }}
                                >
                                  <RemoveIcon fontSize="small" />
                                </IconButton>
                                <Typography
                                  variant="body2"
                                  sx={{ minWidth: 20, textAlign: "center" }}
                                >
                                  {item.quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  sx={{ p: 0.25 }}
                                >
                                  <AddIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={() => removeFromCart(item.id)}
                              sx={{ color: "error.main" }}
                            >
                              <CloseIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Divider />
                        </Box>
                      ))}
                      <Box sx={{ p: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 2,
                          }}
                        >
                          <Typography fontWeight="bold">Total:</Typography>
                          <Typography fontWeight="bold">
                            ₪{cartTotal.toFixed(2)}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          fullWidth
                          component={Link}
                          to="/cart"
                        >
                          View Cart
                        </Button>
                      </Box>
                    </>
                  )}
                </Box>
              </Popover>
            </Box>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!isLoggedIn && (
                <MenuItem
                  onClick={() => {
                    signInWithRedirect({ provider: "Google" });
                    handleCloseUserMenu();
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      pl: 2,
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    Login with Google
                  </Typography>
                </MenuItem>
              )}
              {isLoggedIn && (
                <Link to={"account/profile"}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        pl: 2,
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      Profile
                    </Typography>
                  </MenuItem>
                </Link>
              )}
              {isLoggedIn && (
                <Link to={"account/orders"}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        pl: 2,
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      Your Orders
                    </Typography>
                  </MenuItem>
                </Link>
              )}
              {isLoggedIn && (
                <Link to={"account/info"}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        pl: 2,
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      Account Center
                    </Typography>
                  </MenuItem>
                </Link>
              )}
              {isLoggedIn && (
                <Link to={"account/settings"}>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        pl: 2,
                        textDecoration: "none",
                        color: "black",
                      }}
                    >
                      Settings & preferences
                    </Typography>
                  </MenuItem>
                </Link>
              )}
              {isLoggedIn && (
                <MenuItem
                  onClick={async () => {
                    await signOut({ global: false });
                    setIsLoggedIn(false);
                    handleCloseUserMenu();
                  }}
                >
                  <Typography
                    sx={{
                      textAlign: "center",
                      pl: 2,
                      textDecoration: "none",
                      color: "black",
                    }}
                  >
                    Sign Out
                  </Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

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
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Link } from "react-router-dom";
import { signInWithRedirect, getCurrentUser, signOut } from "aws-amplify/auth";
import logo from "../../assets/images/logo.jpg";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [anchorElNav, setAnchorElNav] = useState<HTMLElement | null>(null);
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    getCurrentUser()
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false));
  }, []);

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
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
            <Link to={"cart"}>
              <Tooltip title="Shopping Cart">
                <IconButton>
                  <Badge badgeContent={cartCount} color="error">
                    <ShoppingCartIcon sx={{ color: "white" }} />
                  </Badge>
                </IconButton>
              </Tooltip>
            </Link>
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
                    await signOut();
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

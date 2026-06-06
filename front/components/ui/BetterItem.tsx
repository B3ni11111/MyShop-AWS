import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CloseIcon from "@mui/icons-material/Close";
import { useAppContext } from "../../hooks/useAppContext";
import { Link } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";
import type { BetterItemProps } from "../../types";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "95%",
    sm: "85%",
    md: "70%",
    lg: "60%",
    xl: "50%",
  },
  maxWidth: 900,
  bgcolor: "background.paper",
  border: 1,
  borderColor: "secondary.main",
  boxShadow: 24,
  borderRadius: "20px",
  p: { xs: 2, sm: 3, md: 4 },
  color: "text.primary",
  display: "flex",
  flexDirection: { xs: "column", sm: "row" },
  alignItems: { xs: "center", sm: "flex-start" },
  gap: { xs: 2, sm: 3, md: 4 },
  maxHeight: "90vh",
  overflowY: "auto",
};

export default function BetterItem({ i, compact = false }: BetterItemProps) {
  const { addToCart, fav, toggleFav } = useAppContext();
  const isFav = fav.some((item) => item.id === i.id);

  const [open, setOpen] = useState<boolean>(false);
  const [expandTitle, setExpandTitle] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Card
        sx={{
          borderRadius: "5%",
          cursor: "pointer",
          width: "100%",
          maxWidth: compact
            ? { xs: 100, sm: 120, md: 140 }
            : { xs: 200, sm: 240, md: 280 },
          height: "100%",
          mx: "auto",
          "&:hover": { boxShadow: 6 },
        }}
        onClick={handleOpen}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: compact
                ? { xs: "60px", sm: "80px", md: "100px" }
                : { xs: "140px", sm: "170px", md: "200px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: compact ? 0.5 : 1,
              bgcolor: "#ffffff",
              borderRadius: 1,
            }}
          >
            <img
              src={i.img}
              alt={i.product}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
              }}
            />
          </Box>
          <Typography
            variant={compact ? "body2" : "h6"}
            sx={{
              mt: compact ? 0.5 : 1,
              minHeight: compact ? "2.5em" : "3em",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              wordWrap: "break-word",
              fontWeight: compact ? 500 : undefined,
            }}
          >
            {i.product}
          </Typography>
          <Typography
            variant={compact ? "body2" : "body1"}
            sx={{ mt: compact ? 0.5 : 1, mb: compact ? 0.5 : 1 }}
          >
            ₪{i.price}
            {!compact && (
              <>
                <span>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(i);
                    }}
                    sx={{ color: "primary.main" }}
                  >
                    <AddShoppingCartIcon />
                  </IconButton>
                </span>
                <Tooltip title={i.info}>
                  <IconButton onClick={(e) => e.stopPropagation()}>
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Typography>
          <Box onClick={(e) => e.stopPropagation()} sx={{ mt: "auto" }}></Box>
        </CardContent>
      </Card>
      {/* after press*/}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "text.secondary",
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box
            sx={{
              width: { xs: 180, sm: 200, md: 250 },
              height: { xs: 180, sm: 200, md: 250 },
              bgcolor: "#ffffff",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <img
              src={i.img}
              alt={i.product}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </Box>

          <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  WebkitLineClamp: expandTitle ? "unset" : 2,
                  transition: "0.3s",
                  flexGrow: 1,
                }}
              >
                {i.product}
              </Typography>

              <IconButton
                size="small"
                onClick={() => setExpandTitle((prev) => !prev)}
                sx={{ color: "text.secondary", mt: "2px" }}
              >
                {expandTitle ? (
                  <KeyboardArrowUpIcon />
                ) : (
                  <KeyboardArrowDownIcon />
                )}
              </IconButton>
            </Box>

            <Typography variant="body1" sx={{ mt: 2, mb: 2 }}>
              {i.info}
            </Typography>
            <Typography variant="h6" sx={{ color: "text.secondary", mb: 2 }}>
              ₪{i.price}
            </Typography>
            <Link to={`/item-page/${i.id}`} style={{ textDecoration: "none" }}>
              <Button variant="contained">go to page</Button>
            </Link>
            <Box
              onClick={(e) => e.stopPropagation()}
              sx={{ mt: 2, display: "flex", gap: 2 }}
            >
              <Button
                component={Link}
                to="/about"
                state={{ fromCheckout: true }}
                color="success"
                variant="contained"
              >
                Buy Now!
              </Button>
              <Button
                onClick={() => addToCart(i)}
                variant="contained"
                sx={{ borderColor: "primary.main" }}
                endIcon={<AddShoppingCartIcon />}
              >
                Add to cart
              </Button>
              <IconButton
                onClick={() => toggleFav(i)}
                sx={{ color: isFav ? "error.main" : "text.secondary" }}
              >
                {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}

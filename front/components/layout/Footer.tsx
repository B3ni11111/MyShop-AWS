import { Box, Typography, Container, Button } from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

type Inputs = {
  Email: string;
  PhoneNum: string;
};

export default function Footer() {
  const {
    register,
    formState: { errors },
  } = useForm<Inputs>();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#172029",
        color: "white",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
          <Box
            sx={{
              flex: { xs: 1, md: "0 0 55%" },
            }}
          >
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <Link to={"/about"}>
                <InstagramIcon sx={{ color: "white" }} />
              </Link>
              <Link to={"/about"}>
                <XIcon sx={{ color: "white" }} />
              </Link>
              <Link to={"https://www.linkedin.com/in/bennybar1/"}>
                <LinkedInIcon sx={{ color: "white" }} />
              </Link>
              <Link to={"https://github.com/B3ni11111"}>
                <GitHubIcon sx={{ color: "white" }} />
              </Link>
            </Box>
            <Link to={"/"} style={{ textDecoration: "none" }}>
              <Typography sx={{ color: "white" }}>
                Home
              </Typography>
            </Link>
            <Link to={"/about"} style={{ textDecoration: "none" }}>
              <Typography sx={{ color: "white" }}>about</Typography>
            </Link>
            <Link to={"/cart"} style={{ textDecoration: "none" }}>
              <Typography sx={{ color: "white" }}>Cart</Typography>
            </Link>
            <Link to={"/fav"} style={{ textDecoration: "none" }}>
              <Typography sx={{ color: "white" }}>Your Favorite</Typography>
            </Link>
          </Box>

          <Box
            sx={{
              flex: { xs: 1, md: "0 0 45%" },
            }}
          >
            <Stack
              component="form"
              sx={{ width: "25ch" }}
              spacing={2}
              noValidate
              autoComplete="off"
            >
              <Typography>
                Want to receive promotional notifications? Subscribe to our
                newsletter:
              </Typography>
              <TextField
                sx={{
                  backgroundColor: "white",
                }}
                placeholder="Enter Your Email"
                hiddenLabel
                id="filled-hidden-label-small"
                variant="filled"
                size="small"
                type="email"
                required
                {...register("Email")}
              />
              <TextField
                sx={{
                  backgroundColor: "white",
                }}
                hiddenLabel
                id="filled-hidden-label-small"
                defaultValue="05"
                variant="filled"
                size="small"
                placeholder="Enter Phone Number"
                type="tel"
                required
                {...register("PhoneNum", { required: true })}
              />

              {errors.PhoneNum && <span>This field is required</span>}

              <Button sx={{ color: "white" }} variant="contained" type="submit">
                Submit
              </Button>
            </Stack>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ textAlign: "center", mt: 3 }}>
          © 2026 Benny's Shop. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

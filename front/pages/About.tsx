import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
} from "@mui/material";
import { useLocation } from "react-router-dom";

export default function About() {
  const location = useLocation();
  const fromCheckout = (location.state as { fromCheckout?: boolean } | null)
    ?.fromCheckout;

  const builtItems = [
    "A React + TypeScript frontend deployed and hosted via AWS Amplify",
    "A serverless backend using AWS Lambda and API Gateway, written in Node.js",
    "User authentication with AWS Cognito, including Google OAuth",
    "User-specific data (cart, favourites, last viewed) stored in DynamoDB",
    "A dedicated EC2 instance running MongoDB for product and application data",
  ];

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      {fromCheckout && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Heads up — MyShop isn't a real e-commerce store. It's a personal
          portfolio project, so no orders are processed and nothing is charged.
        </Alert>
      )}

      <Typography variant="h2" sx={{ mb: 3 }}>
        About Us
      </Typography>

      <Typography sx={{ mb: 2, lineHeight: 1.7 }}>
        MyShop is a full-stack e-commerce web application built as a personal
        learning project to gain hands-on experience with modern cloud
        infrastructure and real-world development workflows.
      </Typography>

      <Typography sx={{ mb: 4, lineHeight: 1.7 }}>
        The app allows users to browse products, manage a cart and favourites,
        and authenticate securely — all served through a scalable, serverless
        AWS architecture.
      </Typography>

      <Typography variant="h5" sx={{ mb: 1 }}>
        What I built
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4, mb: 4 }}>
        {builtItems.map((item) => (
          <ListItem key={item} sx={{ display: "list-item", py: 0.25, pl: 0 }}>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>

      <Typography variant="h5" sx={{ mb: 1 }}>
        Tech Stack
      </Typography>
      <Typography sx={{ lineHeight: 1.7 }}>
        React · TypeScript · Node.js · AWS Lambda · API Gateway · Amplify ·
        Cognito · DynamoDB · MongoDB · EC2
      </Typography>
    </Box>
  );
}

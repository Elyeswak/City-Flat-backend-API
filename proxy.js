const { createProxyMiddleware } = require("http-proxy-middleware");
const express = require("express");

const app = express();

// Create a proxy for requests to the Cloudinary API
const cloudinaryProxy = createProxyMiddleware({
  target: "https://api.cloudinary.com",
  changeOrigin: true,
});

// Forward requests to the Cloudinary API to the proxy
app.use("/v1_1/:cloudName/*", cloudinaryProxy);

// Start the server
const port = process.env.PORT || 9090;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

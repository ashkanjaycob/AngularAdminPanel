const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.static(__dirname));

// Proxy for Shopgram API
app.use(
  "/api",
  proxy("www.shopgram123.ir", {
    https: true,
    proxyReqPathResolver: function (req) {
      console.log("Original URL:", req.url);
      const newPath = "/site/api/v1" + req.url.replace("/api", "");
      console.log("New Path:", newPath);
      return newPath;
    },
    proxyReqOptDecorator: function (proxyReqOpts) {
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

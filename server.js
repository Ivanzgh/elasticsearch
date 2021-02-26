const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

// const proxyPath = "http://192.168.130.63:5000";

const proxyPath = "http://130.10.8.111/services/zgh";

const proxyOption = { target: proxyPath, changeOrigin: true };

const app = express();

app.use("/index", express.static("test"));

app.use("/", createProxyMiddleware(proxyOption));
app.listen(8081);

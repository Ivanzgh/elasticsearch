const express = require("express");
const app = express();
const logger = require("morgan");
const indexRouter = require("./resource/index");
const path = require("path");
const bodyParser = require("body-parser");

// 解析post请求体body
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

const PORT = 5000;

// 设置允许跨域访问
app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 控制台日志
app.use(logger("combined"));

// express路由
app.use("/", indexRouter);

//express 静态文件
app.use(express.static(path.resolve("../app")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.listen(PORT, function () {
  console.log("Server is running on PORT:", PORT);
});

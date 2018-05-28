if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Key = require("./models/Key");
const router = require("./routes/keys");
const index = require("./routes/index");

app.use(morgan("short"));
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const isProduction = process.env.NODE_ENV === "production";

if (!isProduction) {
  mongoose.set("debug", true);
}

app.use("/", index);
app.use(router);

module.exports = app;

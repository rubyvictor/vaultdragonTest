if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const express = require('express');
const app = express()
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Key = require('./models/Key');
const router = require('./routes/keys');
const index = require("./routes/index")

app.use(morgan("short"));
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const isProduction = process.env.NODE_ENV === "production";

const dbUrl = process.env.MONGODB_URI;
mongoose.connect(dbUrl, {}).then(async () => {
  console.log("Connected to mongo database at " + dbUrl);
});

mongoose.connect(dbUrl, async function (err) {
  if (err)
    throw err;
  console.log("successfully connected to keys_db");

});

if (!isProduction) {
  mongoose.set("debug", true);
}

app.use("/", index);
app.use(router);

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log("Server is up and listening on:" + PORT);
});

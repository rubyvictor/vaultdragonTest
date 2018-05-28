if (process.env.NODE_ENV !== "production") {
  require("dotenv").load();
}

const app = require("./App");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) throw err;
  console.log("db connected successfully at keys_db");

  const server = app.listen(process.env.PORT || 3003, () => {
    console.log(`Listening on port ${server.address().port}...`);
  });
});

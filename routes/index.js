var express = require("express");
var router = express.Router();

// GET home page
router.get("/", function(req, res, next) {
  res.json({ message: "welcome to my test solution for vault dragon" });
});

module.exports = router;

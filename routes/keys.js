const express = require("express");
const router = express.Router();
const Key = require("../models/Key");

router.post("/object", async (req, res) => {
  console.log(req.body, "creating new key-value object");
  try {
    let key = req.body.key;
    let timestamp = Date.now();
    timestamp = (timestamp - timestamp % 1000) / 1000;
    let value = req.body;

    for (const k in value) {
      if (value.hasOwnProperty(k)) {
        key = k;
        value = value[k];
      }
    }

    const newKey = new Key({
      key: key,
      timestamp: timestamp,
      value: value
    });

    await newKey.save();
    console.log("new Key value pair created:", newKey);

    const query = { key: key, timestamp: timestamp };
    const updateObject = { value: value };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    await Key.findOneAndUpdate(query, updateObject, options, (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
        return;
      }
      console.log(result);
      res.json(result);
    });
  } catch (error) {
    console.log(res.status(404), error.message);
    res.send(error);
  }
});

module.exports = router;

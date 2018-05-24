const express = require("express");
const router = express.Router();
const { Key, Value } = require("../models/Key");

router.post("/object", async (req, res) => {
  console.log(req.body, "creating new key-value object");
  try {
    let key = req.body.key;
    let timestamp = Date.now();
    timestamp = (timestamp - timestamp % 1000) / 1000;
    let value = req.body;

    for (let k in value) {
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
    res.send({ "Successfully created key value pair": newKey });
  } catch (error) {
    console.log(res.status(404), error.message);
    res.send(error);
  }
});

router.get("/object/:key", async (req, res) => {
  let key = req.params.key;
  console.log("querying to find key");
  let timestamp = req.query.timestamp;
  if (timestamp) {
    console.log("timestamp provided is", timestamp);
  } else {
    timestamp = Date.now();
    timestamp = (timestamp - timestamp % 1000) / 1000;
    console.log("timestamp not in query, use current time:", timestamp);
  }

  await Key.find({ key }, (err, result) => {
    if (err) {
      res.send(err);
    } else if (result.length === 0) {
      console.log(res);
      console.log("Key does not exist in db");
      res.status(404).json({ message: "Key does not exist in db" });
    } else {
      let timeHolder = -1;
      let index = -1;

      for (let i = 0; i < result.length; i++) {
        const item = result[i];
        if (item.timestamp > timeHolder && item.timestamp <= timestamp) {
          timeHolder = item.timestamp;
          index = i;
        }
      }

      if (index === -1) {
        res.status(404).send({ message: "No such key at this timestamp" });
      } else {
        const returnedValue = new Value({ value: result[index].value });
        console.log("value return from query:", returnedValue);
        res.json(returnedValue);
      }
    }
  });
});

module.exports = router;

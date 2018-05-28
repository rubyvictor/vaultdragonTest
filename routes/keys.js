const express = require("express");
const router = express.Router();
const { Key, Value } = require("../models/Key");
const moment = require("moment");

router.post("/object", async (req, res) => {
  try {
    let key = req.body.key;
    let timestamp = Date.now();
    timestamp = Math.round(timestamp / 1000);
    let value = req.body;

    if (Object.keys(value).length != 1) {
      const errorMessage = {
        message: "There must be a proper request body of a key and a value pair"
      };
      res.status(404).send(errorMessage);
      return;
    }

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
    res.send({ "Successfully created key value pair": newKey });
  } catch (error) {
    res.send(error);
  }
});

router.get("/object/:key", async (req, res) => {
  let key = req.params.key;
  let timestamp = req.query.timestamp;
  if (timestamp) {
    console.log(
      "timestamp provided is",
      moment(timestamp * 1000).format("YYYY-MM-DD h:mm a")
    );
  } else {
    timestamp = Date.now();
    timestamp = Math.round(timestamp / 1000);
  }

  await Key.find({ key }, (err, result) => {
    if (err) {
      res.send(err);
    } else if (result.length === 0) {
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
        res.json(returnedValue);
      }
    }
  });
});

module.exports = router;

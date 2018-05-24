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

router.get("/object/:key", (req, res) => {
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

  const query = { key: key };
  Key.find(query, (err, res) => {
    if (err) {
      res.send(err.message);
    } else if (res.length === 0) {
      console.log("Key does not exist in db");
      res.status(404).json({ message: "Key does not exist in db" });
    } else {
      let timeHolder = -1;
      let index = -1;

      for (let i = 0; i < res.length; i++) {
        const item = res[i];
        if (item.timestamp > timeHolder && item.timestamp <= timestamp) {
          timeHolder = item.timestamp;
          index = i;
        }
      }

      if (index === -1) {
        res.status(404).send({ message: "No such key at this timestamp" });
      } else {
        res.map(value => {
          return { value: res[index].value };

          console.log(value);
          res.json(value);
        });
      }
    }
  });
});

module.exports = router;

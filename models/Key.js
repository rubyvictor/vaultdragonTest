"user strict";

const mongoose = require("mongoose");

xTransform = (doc, ret) => {
  delete doc.__v;
  delete doc._id;
  return ret;
};

const options = {
  toObject: {
    transform: xTransform
  },
  toJSON: {
    transform: xTransform
  }
};

const keySchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: "Enter a key pls"
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    value: {
      type: Object,
      default: ""
    }
  },
  options
);

const Key = mongoose.model("Key", keySchema);

const ValueSchema = mongoose.Schema(
  {
    value: {
      type: Object,
      default: ""
    }
  },
  options
);

const Value = mongoose.model("Value", ValueSchema);
module.exports = { Value, Key };

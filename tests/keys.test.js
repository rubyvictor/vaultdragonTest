process.env.ENV = "test";

const app = require("../App");
const mongoose = require("mongoose");
const { Key, Value } = require("../models/Key");
const request = require("supertest");

describe("Initiate db and clear model", () => {
  let db;

  beforeAll(async done => {
    const dbUri = "mongodb://localhost/keys_test_db";
    db = await mongoose.connect(dbUri, () => {
      console.log("connected to test DB successfully at " + dbUri);
    });

    Key.remove({}, err => {
      let keyValueEntry = new Key({
        key: "first_key",
        value: "key at first",
        timestamp: 1000
      });

      keyValueEntry.save(() => {});
      done();
    });
  });

  it("GET /object/first_key should return value of 'key at first'", async () => {
    const key = "first_key";
    const expectedKeyValuePair = await Key.find({ key });
    const response = await request(app).get("/object/first_key");
    expect(response.status).toEqual(200);
    expect(response.header["content-type"]).toContain("application/json");
    expect(response.body.value).toEqual(expectedKeyValuePair[0].value);
  });
});

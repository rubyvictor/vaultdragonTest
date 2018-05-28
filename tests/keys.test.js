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

      let keyTwoValueEntry = new Key({
        key: "first_key",
        value: "key at second",
        timestamp: 2000
      });

      let keyThreeValueEntry = new Key({
        key: "first_key",
        value: "key at third",
        timestamp: 3000
      });

      keyValueEntry.save(() => {});
      keyTwoValueEntry.save(()=>{});
      keyThreeValueEntry.save(()=>{});
      done();
    });
  });

  it("GET /object/first_key should return latest value of 'key at first'", async () => {
    const key = "first_key";
    const expectedKeyValuePair = await Key.find({ key });
    const response = await request(app).get("/object/first_key");
    expect(response.status).toEqual(200);
    expect(response.header["content-type"]).toContain("application/json");
    expect(response.body.value).toEqual("key at third");
  });

  it("GET /object/first_key should return value of 'key at second' for timestamp=2500", async () => {
      const key = "first_key";
      const expectedKeyValuePair = await Key.find({ key });
      const response = await request(app).get("/object/first_key?timestamp=2500");
      expect(response.status).toEqual(200);
      expect(response.header["content-type"]).toContain("application/json");
      expect(response.body.value).toEqual("key at second");
  });

    it("GET /object/a_key should return message: key does not exist in db", async () => {
        const key = "a_key";
        const expectedKeyValuePair = await Key.find({ key });
        const response = await request(app).get("/object/a-key");
        expect(response.status).toEqual(404);
        expect(response.body).toEqual({"message": "Key does not exist in db"});
    });

});

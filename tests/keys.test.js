process.env.NODE_ENV = "test";

const app = require("../App");
const mongoose = require("mongoose");
const Key = require("../models/Key");
const request = require("supertest");

const message = "message";
const key = "key";
const value = "value";
const timestamp = "timestamp";

describe("routes/keys", () => {
  let db;

  beforeAll(async () => {
    const dbUri = "mongodb://localhost/keys_test_db";
    db = await mongoose.connect(dbUri, () => {
      console.log("connected to test DB successfully");
    });

    await Key.deleteMany().exec();
  });

  it("GET /object/myKey should accept a key and return the corresponding latest value", async () => {
    const expectedKeyValuePair = await Key.find({key});
    const response = await request(app).get("/object/myKey");
    expect(response.status).toEqual(200);
    expect(response.header["content-type"]).toContain("application/json");
    expect(response.body).toEqual(expectedKeyValuePair);
  });
});

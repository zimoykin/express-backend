import * as mongoose from "mongoose";
import { app } from "./app";


const request = require("supertest");
require("dotenv").config();

let token: string;

beforeAll( (done) => {
  console.log("Test started");

  mongoose.connect("mongodb://localhost:27017/expdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: process.env.ADMIN_DB,
    pass: process.env.PASSWORD_DB,
    poolSize: 10,
    useCreateIndex: true,
    authSource: "admin",
  });

  mongoose.connection.once("open", () => {
    console.log("db connected!");

    request(app)
      .post("/api/users/login")
      .send({
        email: process.env.admin_email || '',
        password: process.env.admin_password || "",
      })
      .end((err, response) => {
        if(err) {
          throw new Error();
        }

        if (response.statusCode == 200) {
          token = response.body.accessToken;
          done();
        } else {
          throw new Error();
        }
      });
  });
});

describe("Test #1 api/users + connect to base", () => {
  it("gets the test endpoint", async (done) => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    done();
  });
});

describe("Test #2 api/todos", () => {
  it("gets the test endpoint", async (done) => {
    const response = await request(app)
      .get("/api/todos")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.type).toBe("application/json");
    done();
  });
});

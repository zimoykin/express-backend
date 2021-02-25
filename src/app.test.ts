import  * as mongoose from "mongoose";
import { app } from "./app";
import { Users } from "./model/User";

const supertest = require("supertest");
const request = supertest(app);

mongoose
  .connect("mongodb://localhost:27017/expdb", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    user: "user",
    pass: "pass",
    poolSize: 10,
    useCreateIndex: true,
    authSource: "admin",
  })

mongoose.connection.on("error", () => {
  console.log("mongo error");
});
mongoose.connection.once("open", () => {
  console.log("db connected!");
  const port = process.env.PORT || 8080;
  //start
  app.listen(port, () => {
    console.log(`server started on ${port}`);
  });
});

describe("Test #1 api/users + connect to base", () => {
  it("gets the test endpoint", async (done) => {
    const response = await request.get('/api/users');
    expect(response.status).toBe(200);
    done();
  });
});

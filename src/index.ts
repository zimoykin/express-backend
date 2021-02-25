import { Mongoose } from "mongoose";
import { app } from "./app";
require("dotenv").config();

export const mongoose: Mongoose = require("mongoose");

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

module.exports.app = app;

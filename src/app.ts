import { logger } from "./middlewares/logger";
import * as express from "express";
import { authorization } from "./middlewares/authorrization";
import { Mongoose } from "mongoose";

export const mongoose: Mongoose = require('mongoose');
require("dotenv").config();

//init
const app = express();
var db: Mongoose = undefined;

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
//app.use(authorization)

const port = process.env.PORT || 8080;

//routes
app.use("/", require("./routes/index.ts"));

mongoose.connect("mongodb://localhost:27017/expdb", { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    user: 'user',
    pass: 'pass',
    poolSize: 10,
    useCreateIndex: true,
    authSource: "admin"
})
.then( () => {})
.catch ( (error) => { console.log (error)})

mongoose.connection.on("error", () => {
    console.log("mongo error")});
mongoose.connection.once("open", () => {
  console.log("Connection Successful!");
});

//start
app.listen(port, () => {
    console.log(`server started on ${port}`);
});

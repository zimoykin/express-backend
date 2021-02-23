"use strict";
exports.__esModule = true;
var logger_1 = require("./middlewares/logger");
var express = require("express");
require('dotenv').config();
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger_1.logger);
var port = process.env.PORT || 8080;
app.use('/', require('./routes/index.ts'));
app.listen(port, function () {
    console.log("server started on " + port);
});

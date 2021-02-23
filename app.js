const express = require("express");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080

app.use('/',require('./routes'));

app.listen(port, () => {
    console.log(`server started on ${port}`)
})
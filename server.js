// server.js
var cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require("express");
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const bankDetailsRouter = require("./routes/bankDetails");
const supplier = require("./routes/supplier");
const product = require("./routes/product");
const order = require("./routes/order");

app.use("/", bankDetailsRouter);
app.use("/",supplier);
app.use("/",product);
app.use("/",order);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
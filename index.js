const express = require('express');
require('dotenv').config();
const app = express();
require('./startup/routes')(app);

const mongoose = require('mongoose');

mongoose.connect(process.env.DB, { useNewUrlParser: true})
        .then(() => console.log(`Connected to node-with-mongo...`))
        .catch((err)=>console.log(`Not-Connected to node-with-mongo... ${err.message}`));


app.listen(3000,()=> console.log("3000 host is ready..."));
const express = require("express");
const fs = require("fs");
const path = require("path");
const util = require("util");
const {v4:uuidv4} = require("uuid");

const PORT = 3001;
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("public"));

app.listen(PORT, ()=> {console.log("app Running")});

//write 5 routes
//two static to send index and notes html
//3 api routes to get, add and delete note
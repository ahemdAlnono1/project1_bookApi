const { Sequelize, DataTypes } = require("sequelize");
const express =  require("express");

const app =express();


const sequelize = new Sequelize("booksapp", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

app.get("/" , function(req, res){
  res.send("good job");
})
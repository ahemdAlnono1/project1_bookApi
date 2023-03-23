const { Sequelize, DataTypes } = require("sequelize");
const express =  require("express");

const app =express();


const sequelize = new Sequelize("booksapp", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});
const Author = sequelize.define(
  "Author",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

const Book = sequelize.define(
  "Book",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: false }
);

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wishes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    reading: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
  },
  { timestamps: false }
);
sequelize.sync();

app.use(express.json());
app.use(express.urlencoded());
const port = process.env.PORT || 3000;

app.get("/" , function(req, res){
  res.send("good job");
})
app.listen(port);
console.log(`server is running on port ${port}`);
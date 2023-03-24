const { Sequelize, DataTypes , Model } = require("sequelize");
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
  { timestamps: false, alert: true }
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
    price:{
      type:DataTypes.INTEGER,
      allowNull:false,
      defaultValue:0
    },
    authors:{
      type:DataTypes.STRING,
      allowNull:false,
    }
  },
  { timestamps: false , alert :true}
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
      }
  },
  { 
      timestamps: false,
      alert: true 
  }
);

const Wish = sequelize.define(
  "Wish",
  {
      description: {
          type: DataTypes.STRING,
          allowNull: false,
      }
  },
  { 
      timestamps: false,
      alert: true 
  }
);
const Reading = sequelize.define(
  "Reading",
  {
      description: {
          type: DataTypes.STRING,
          allowNull: false,
      }
  },
  { 
      timestamps: false,
      alert: true 
  }
);

User.hasMany(Reading);
User.hasMany(Wish);
Wish.belongsTo(User);
Reading.belongsTo(User);

sequelize.sync();
      
app.use(express.json());
// app.use(express.urlencoded());
const port = process.env.PORT || 3000;

app.get("/sigin/author/:author" , async function(req, res){
  const { author } = req.params;
  const { password } = req.body;

  try {
    const newAuthor = await Author.create({
      name: author,
      password,
    });
    res.send("new author created");
  } catch (error) {
    console.error(error);
    res.send("Error creating author");
  }
})
app.listen(port);
console.log(`server is running on port ${port}`);
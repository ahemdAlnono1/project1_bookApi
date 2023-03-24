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
  },
  { timestamps: false , alert :true}
);
const BookAuthor = sequelize.define('book_author', {});

Book.belongsToMany(Author, { through: BookAuthor });
Author.belongsToMany(Book, { through: BookAuthor });

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

app.post("/sigin/author/:author" , async function(req, res){
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

app.get("/author/:author", async function(req, res){
  const { author } = req.params;
  const { password } = req.body;

  try {
    const foundAuthor = await Author.findOne({
      where: {
        name: author,
        password,
      },
    });

    if (foundAuthor) {
      res.send(`welcome ${foundAuthor.name}`);
    } else {
      res.send("author not found");
    }
  } catch (error) {
    console.error(error);
    res.send("Error finding author");
  }
})

app.post("/new/:book" , async function(req, res){
  const book = new Book({
    name:req.params.book,
    body:req.body.body,
    price: req.body.price
  })
  await book.save();
  for(let i = 0 ;i < req.body.authors.length; i++){
    try{
      const author = await Author.findOne({where:{name:req.body.authors[i]}});
      await author.addBook(book);
      await book.addAuthor(author);
    }catch(e){
      console.log(e);
      res.send("cannt add author")
      break;
    }
  }
  res.send("book is added")
})
app.get("/find/:book" , async function(req, res){
  const book = await Book.findOne({where:{name:req.params.book}});
  console.log(book);
  const authors = await book.getAuthors();
  console.log(authors.map(author => author.dataValues));
  res.send("find the book");
})
app.listen(port);
console.log(`server is running on port ${port}`);
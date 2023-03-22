// const {Sequelize , DataTypes} = require("sequelize");
// const sequelize = new Sequelize ("booksapp" , "root" , "password",{
//     HOST:"localhost",
//     dialect:"mysql",
//     USER: "root",
//     PASSWORD: "password",

// })
const express  = require("express");
const mongoose = require("mongoose");
const User     = require("./database/user");
const Author   = require("./database/author");
const Book     = require("./database/book");

const port = process.env.PORT || 3000;
const app = express();

mongoose.connect("mongodb://localhost/booksApp");

app.use(express.json()) 
app.use(express.urlencoded({extended: false,
    verify: function(req, res, buf, encoding) {
      req.textBody = buf.toString(encoding);
    }
  }));

app.post("/sigin/author/:author" , async function(req, res){
    const author =  new Author({
      name: req.params.author,
      password: req.body.password,
      books:[],
    })
    console.log(req.params.author);
    await author.save();
    res.send("new author created")
})
app.get("/author/:author" , async function(req, res){
    const author = await Author.findOne({name:req.params.author,password:req.body.password})
    console.log(req.params.author);
    console.log(author)
    if(author){
      res.send(`wellcome ${author.name}`);
    }
    else{
      res.send("author not found");
    }
})
app.post("/author/:author/new" , async function(req , res){
    const book = new Book({
      name:req.body.name,
      authors:req.body.authors,
      body: req.body.body,
    })
    for (let i = 0; i < req.body.authors.length; i++) {
      try {
        await Author.findOneAndUpdate(
          { name: req.body.authors[i] },
          { $push: { books: req.body.name } }
        ).exec();
      } catch (err) {
        console.error(err);
      }
    }
    console.log(req.body);
    console.log(req.body.authors);
    book.save();
    res.send("new book added");
})
app.put("/author/:author/edit", async function(req, res){
  const isAuthor = await Book.findOne({name:req.body.name})
  let canEdit = false;
  for(let i = 0;i<isAuthor.authors.length; i++){
    if(req.params.author == isAuthor.authors[i]){
      canEdit = true;
    }
  }
  if(canEdit){
    if(req.body.authors){
      Book.updateOne({name:req.body.name},{
        body:req.body.body,
        authors:req.body.authors
      })
      for (let i = 0; i < req.body.authors.length; i++) {
        try {
          await Author.findOneAndUpdate(
            { name: req.body.authors[i] },
            { $push: { books: req.body.name } }
          ).exec();
        } catch (err) {
          console.error(err);
        }
      }
    }
    else{
      Book.findOneAndUpdate({ name: req.body.name }, { body: req.body.body }, { new: true })
      .then(book => {
        console.log(book);
      })
      .catch(err => {
        console.error(err);
      });
    }
    res.send("the book is edited")
  }
  else{
    res.send("you cann't edit this book")
  }
})
app.post("/sigin/user/:user" , async function(req , res){
  const name = await User.find({name:req.params.name});
  if(!name){
    const user = new User({
      name:req.params.user,
      password:req.body.password,
      wishes:[],
      reading:[],
    })
    await user.save();
    res.send("new user added")
  }
  else{
    res.send("change name")
  }
  console.log(name);
})
app.get("/user/:user" , async function(req, res){
  const user = await User.findOne({name:req.params.user , password:req.body.password});
  if(user){
    res.send(`wellcome ${req.params.user} as reader`);
  }
  else{
    res.send("user not found");
  }
})
app.put("/user/:user/addtowishes" , async function(req, res){
  await User.updateOne({name:req.params.user , password:req.body.password} ,{
    $push:{wishes:res.body.book}
  } )
  res.send("book is added to wish list");
})
app.put("/user/:user/addtoreading" , async function(req, res){
  await User.updateOne({name:req.params.user , password:req.body.password} ,{
    $push:{reading:res.body.book}
  } )
  res.send("book is added to reading list");
})
app.get("/:user/read/:book", async function(req, res){
  let book = await Book.findOne({name:req.params.book});
  if(book){
    res.send(book)
  }
  else{
    res.send("book not found")
  }
})

app.listen(port)

console.log(`app is running in port ${port}`);
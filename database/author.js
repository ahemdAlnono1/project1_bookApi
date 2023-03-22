const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique: true,
    },
    password: String,
    books: [String],
})

module.exports = mongoose.model("Author" , chatSchema)
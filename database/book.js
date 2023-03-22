const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
        unique: true,
    },
    body: String,
    authors: [String],
})

module.exports = mongoose.model("Book" , chatSchema)
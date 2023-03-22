const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        unique: true,
    },
    password: String,
    wishes: [String],
    reading:[String],
})

module.exports = mongoose.model("User" , chatSchema)
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
  name:{
    type: String,
    required: true
  },
  email:{
    type: String,
    required: true
  },
  pass:{
    type: String,
    required: true
  },
  permission:{
    type: Boolean,
    default: false
  }
})

mongoose.model("users", User)

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Posts = new Schema({
  title:{
    type: String,
    required: true
  },

  desc:{
    type: String,
    required: true
  },
  github:{
    type: String,
    required: true
  },
  postslug:{
    type: String,
    required: true
  },
  category:{
    type: Schema.Types.ObjectId,
    ref: "categories",
    required: true
  },
  date:{
    type: Date,
    default: Date.now
  }

})


mongoose.model("posting", Posts)

//Starting modules
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const main = require('./routes/admin')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
require("./models/posts")
const Post = mongoose.model("posting")
require("./models/categoria")
const Category = mongoose.model("categories")
const user = require("./routes/users")
const passport = require("passport")
require("./config/auth")(passport)

//Configurações
const PORT = 8090
  //Sessao
  app.use(session({
    secret: 'IdSession',
    resave: true,
    saveUnitialized: true
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(flash())
  //middleware
    app.use((req,res, next) => {
      res.locals.success_msg = req.flash("success_msg")
      res.locals.error_msg = req.flash("error_msg")
      res.locals.error = req.flash("error")
      res.locals.user = req.user || null;
      next()
    })
  //bodyParser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
  //HandleBars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
  //Mongoose
    mongoose.Promise = global.Promise
    mongoose.connect('mongodb://localhost/portfolio').then(() => {
      console.log("Conectado ao mongo")
    }).catch((err) => {
      console.log(`Erro ao se conectar ao DB ${err}`)
    })
  //Public
  app.use(express.static(path.join(__dirname, 'public')))
//Rotas
  app.get("/", (req,res) => {
    Post.find().populate("category").sort({date: "desc"}).then((post) => {
      res.render("index", {post: post})
    }).catch((err) => {
      req.flash("error_msg", `Erro ao renderizar post`)
    })

  })
  app.get("/posts", (req,res) => {
    Post.find().populate("category").sort({date: "desc"}).then((post) => {
      res.render("posts", {post: post})
    }).catch((err) => {
      req.flash("error_msg", `Erro ao renderizar post`)
    })

  })
  app.get("/categorias", (req,res) => {
    Category.find().then((category) => {
      res.render("categories/index", {category: category})
    }).catch((err) => {
      req.flash("error_msg", `Erro ao renderizar post`)
    })
  })

  app.post("/categorias/:slug", (req,res) => {
    Category.findOne({slug: req.params.slug}).then((category) => {
      if(category){
        Post.find({category: category._id}).then((post) => {
          res.render("categories/show", {post: post, category: category})
        })
      }
    })
  })
  app.use('/main', main)
  app.use('/user', user)
//Start no servidor
  app.listen(PORT,() => {
    console.log(`Servidor iniciado na porta ${PORT}`)
  })

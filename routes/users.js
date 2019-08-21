const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/User")
const User = mongoose.model("users")
const bcrypt = require("bcryptjs")
const passport = require("passport")


  router.get("/newaccount", (req,res) => {
    res.render("users/newuser")
  })

router.post("/new", (req,res) => {
  var erros = []
  if(!req.body.name || typeof req.body.name == undefined || req.body.name == null){
    erros.push({texto: "Nome invalido"})
  }
  if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
    erros.push({texto: "Email invalido"})
  }
  if(!req.body.password || typeof req.body.password == undefined || req.body.password == null){
    erros.push({texto: "Senha invalido"})
  }
  if(req.body.password.length <= 8){
    erros.push({texto: "Senha muito curta"})
  }
  if(req.body.password != req.body.password2 ){
    erros.push({texto: "Senhas não são iguais"})
  }
  if(erros.length > 0){
    res.render("users/newuser", {erros: erros})
  }else{
    User.findOne({email: req.body.email}).then((usuario) => {
      if(usuario){
        req.flash("error_msg", "Email existente")
        res .redirect("/user/newaccount")
      }else{
        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          pass: req.body.password,
        })
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.pass, salt, (err, hash) => {
            if(err){
              req.flash("error_msg", "Erro durante o salvamento de usuario")
              res.redirect("/user/newaccount")
            }

            newUser.pass = hash
            newUser.save().then(() => {
              req.flash("success_msg", "Usuario criado com sucesso")
              res.redirect("/user/newaccount")
            }).catch((err) => {
              req.flash("error_msg", `Erro ao criar o usúario: ${err}`)
              res.redirect("/user/newaccount")
            })
          })
        })
      }
    }).catch((err) => {
      req.flash("error_msg", `Erro interno${err}`)
      res.redirect("/user/newaccount")

    })
  }
})
router.get("/login", (req,res) => {
  res.render("users/login")
})
router.post("/login", (req,res,next) => {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/login",
    failureFlash: true
  })(req,res,next)
})
router.get("/logout", (req,res) => {
  req.logout()
  req.flash("success_msg", "Deslogado com sucesso")
  res.redirect("/")
})
module.exports = router

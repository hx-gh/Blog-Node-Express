const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require("../models/categoria")
const Category = mongoose.model('categories')
require("../models/posts")
const Post = mongoose.model("posting")
const {admin} = require("../helpers/authorization")

//Definição de Rotas

router.get('/',admin,(req,res) => {
  res.render('main/index')
})

router.get('/projects', admin, (req,res) => {
  res.render('main/projects')
})
router.get('/categories',admin,(req,res) => {
  Category.find().then((categories) => {
    res.render('main/categories', {categorias: categories})
  }).catch((err) => {
    req.flash(`${error_msg} Erro ao listar as categorias ${err}`)
    res.redirect("/main")
  })

})
router.get('/addcategory',admin,(req, res) => {
  res.render('main/addcategory')
})
router.get('/about',admin,(req,res) => {
  res.render('main/about')
})

router.post('/categories/nova', admin,(req,res) => {
  var erros = []
    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
    erros.push({text: "Invalid Name"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){
    erros.push({text: "Invalid Slug"})
    }
  console.log(erros)
    if(erros.length > 0){
    res.render("main/addcategory", {erros: erros})
    }
    else{
      const novaCategoria = {
      nome: req.body.nome,
      slug: req.body.slug
      }
      new Category(novaCategoria).save().then(() => {
        req.flash("success_msg", "Categoria criada com sucesso")
        res.redirect('/main/categories')
      }).catch((err) => {
        req.flash("error_msg" `Houve um erro ao salvar a categoria${err}`)
        res.redirect('/main/addcategory')
      })
    }
})

router.get('/categories/edit/:id', admin,(req,res) => {
  Category.findOne({_id:req.params.id}).then((category) => {
    res.render("main/editcategories", {category: category})
  }).catch((err) => {
    req.flash("error_msg", `Erro ${err}`)
    res.redirect("/main/categories")
  })
})

router.post('/categories/edit',admin, (req,res) => {
  err = []
  err.push(req.body.nome)
  err.push(req.body.slug)
  console.log(err)
  Category.findOne({id:req.body._id}).then((categories) => {
    categories.nome = req.body.nome
    categories.slug = req.body.slug

    categories.save().then(() => {
      req.flash("success_msg", "Categoria editada com sucesso")
      res.redirect("/main/categories")
    }).catch((err) => {
      req.flash("error_msg", `erro ao editar a categoria ${err}`)
      res.redirect("/main/categories")
    })
})
})

router.post("/categories/delete",admin, (req,res) => {
  Category.deleteOne({_id:req.body.id}).then(() => {
    req.flash("success_msg", "Categoria deletada com sucesso")
    res.redirect("/main/categories")
  }).catch((err) => {
    req.flash("error_msg", `Erro ao deletar a categoria ${err}`)
    res.redirect("/main/categories")
  })
})

router.get("/posts",admin, (req,res) => {
  Post.find().populate("category").sort({date: "desc"}).then((posts) => {
    res.render("main/posts", ({posts: posts}))
  })

})

router.get("/posts/addpost",admin, (req,res) => {
  Category.find().then((categories) => {
    res.render("main/addpost", {categories: categories})
  }).catch((err) => {
    req.flash("error_msg", `Erro ao deletar a categoria ${err}`)
    res.redirect("/main/categories")
  })
})

router.post("/posts/add",admin, (req,res) => {
   const newPost = {
     title: req.body.title,
     desc: req.body.desc,
     github: req.body.github,
     category: req.body.categories,
     postslug: req.body.postslug,
   }

   new Post(newPost).save().then(() => {
     req.flash("success_msg", "Postagem criada com sucesso")
     res.redirect("/main/posts")
   }).catch((err) => {
     req.flash("error_msg", `Erro ao criar postagem ${err}`)
     res.redirect("/main/posts/addpost")
   })
})
router.get("/posts/edit/:id",admin, (req,res) => {
  Post.findOne({_id:req.params.id}).then((post) => {
    Category.find({_id:req.params.id}).then((category) => {
      res.render("main/editpost", {category: category, post: post})
    }).catch((err) => {
      req.flash("error_msg", `Erro ${err}`)
      res.redirect("/main/post")
    })
  })
})

router.post("/posts/edit",admin, (req,res) => {
  Post.findOne({_id:req.body.id}).then((post) => {
    post.title = req.body.title
    post.desc = req.body.desc
    post.github = req.body.github
    post.category = req.body.categories
    post.postslug = req.body.postslug
    post.save().then(() => {
      req.flash("success_msg", "Post editado com sucesso")
      res.redirect("/main/posts")
    }).catch((err) => {
      req.flash("error_msg", `Erro ao editar a post ${err}`)
    })
  }).catch((err) => {
    req.flash("error_msg", `Erro ao carregar editacao de post ${err}`)
    res.redirect("/main/posts")
  })
})

router.post("/posts/delete",admin, (req,res) => {
  Post.deleteOne({_id:req.body.id}).then(() => {
    req.flash("success_msg", "Categoria deletada com sucesso")
    res.redirect("/main/posts")
  }).catch((err) => {
    req.flash("error_msg", `Erro ao deletar a categoria ${err}`)
    res.redirect("/main/posts")
  })
})

router.get("/post/:postslug",admin, (req,res) => {
  Post.findOne({id:req.body._id}).then((post) => {
    res.render("post", ({post: post}))
  })

})

module.exports = router

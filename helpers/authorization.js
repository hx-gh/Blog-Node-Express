module.exports = {
  admin: ((req, res, next) => {
    if(req.isAuthenticated() && req.user.permission == true){
      return next();
    }
    req.flash("error_msg", "Você deve estar logado como ADMIN para acessar está pagina")
    res.redirect("/")
  })

}

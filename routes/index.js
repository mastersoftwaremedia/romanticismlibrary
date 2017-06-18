var express = require('express')
var passport=require('passport')
//var User=require('../models/user')
var router = express.Router()

function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next()
	res.redirect('/')
}


/* GET home page. */
router.get('/',function(req, res){
	res.render('index')
})
router.get('/',isLoggedIn,function(req,res){
	res.render('index',{user:req.user})
})
router.get('/profile',isLoggedIn,function(req,res){
	res.render('profile',{user:req.user})
})
router.get('/logout',function(req,res){
	req.logout()
	res.redirect('/')
})

//local
router.get('/login',function(req,res){
	res.render('login',{message:req.flash('loginMessage')})
})
router.post('/login',passport.authenticate('local-login',{
	successRedirect:'/',
	failureRedirect:'/login',
	failureFlash:true
}))

router.get('/signup',function(req,res){
	res.render('signup',{message:req.flash('signupMessage')})
})
router.post('/signup',passport.authenticate('local-signup',{
	successRedirect:'/login',
	failureRedirect:'/signup',
	failureFlash:true
}))

module.exports = router

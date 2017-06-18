//var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy
var User=require('../models/user')


module.exports=function(passport){
	passport.serializeUser(function(user,done){
		done(null,user.id)
	})
	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
			if(!err)done(null,user)
			else done(err,null)
		})
	})
	
	passport.use('local-login',new LocalStrategy({
		usernameField:'email',
		passwordField:'password',
		passReqToCallback:true
	},function(req,email,password,done){
		User.findOne({'local.email':email},function(err,user){
			if(err) return done(err)
			if(!user) return done(null,false,req.flash('loginMessage','No user found.'))
			if(!user.validPassword(password)) return done(null,false,req.flash('loginMessage','Oops! Wrong password.'))
			return done(null,user)
		})
	}))
	
	passport.use('local-signup',new LocalStrategy({
		usernameField:'email',
		passwordField:'password',
		passReqToCallback:true
	},function(req,email,password,done){
		User.findOne({'local.email':email},function(err,user){
			if(err) return done(err)
			if(user){ 
				return done(null,false,req.flash('signupMessage','That email already exist.'))}
			if(req.user){
				var user=req.user
				user.local.email=email
				user.local.password=user.generateHash(password)
				user.save(function(err){
					if(err)throw err
					return done(null,user)
				})
			}else{
				var newUser=new User()
				newUser.local.email=email
				newUser.username=req.body.username
				newUser.local.password=newUser.generateHash(password)
				newUser.save(function(err){
					if(err) throw err
					return done(null,newUser)
				})
			}
		})
	}))
}

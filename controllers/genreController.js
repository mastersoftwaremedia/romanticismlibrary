var Genre = require('../models/genre')
var Book=require('../models/book')
var async=require('async')

// Display list of all Genre
exports.genreList = function(req, res, next) {
    Genre.find()
	.sort([['name', 'ascending']])
	.exec(function(err,genres){
		if(err){return next(err)}
		res.render('genre_list',{title:'List of Genres',genres:genres})
	})
}
// Display detail page for a specific Genre
exports.genreDetail = function(req, res, next) {
    async.parallel({
		genre:function(cb){
			Genre.findById(req.params.id)
			.exec(cb)
		},
		genre_books:function(cb){
			Book.find({'genre':req.params.id})
			.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		res.render('genre_detail',{title:'', genre:results.genre, genre_books: results.genre_books})
	})
}
// Display Genre create form on GET
exports.genre_getCreate = function(req, res, next) {
    res.render('genre_create',{title:'Create Genre'})
}
// Handle Genre create on POST
exports.genre_postCreate = function(req, res, next) {
    //Check that the name field is not empty
	req.checkBody('name','Genre name required').notEmpty()
	//Trim and escape the name field
	req.sanitize('name').escape()

	//Run the validators
	var errors=req.validationErrors()
	//create a genre object with escaped and trimmed data
	var genre=new Genre({
		name:req.body.name
	})
	if(errors){
		return res.render('genre_create',{title:'Create Genre',genre:genre,errors:errors})
	}else{
		//Data from form is validationErrors
		//check if Genre with same name already exists
		Genre.findOne({'name':req.params.name})
			.exec(function(err,found_genre){
				console.log('found_genre '+ found_genre)
				if(err){return next(err)}
				if(found_genre){
					//Genre exists,redirect to its detail page
					res.redirect(found_genre.url)
				}else{
					genre.save(function(err){
						if(err){return next(err)}
						//Genre saved. Redirect to genre detail page
						res.redirect(genre.url)
					})
				}
			})
	}
}
// Display Genre delete form on GET
exports.genre_getDelete = function(req, res, next) {
    async.parallel({
		genre:function(cb){
			Genre.findById(req.params.id)
			.exec(cb)
		},
		genre_books:function(cb){
			Book.find({'genre':req.params.id})
			.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		res.render('genre_delete',{title:'Delete Genre',genre:results.genre, genre_books:results.genre_books})
	})
}
// Handle Genre delete on POST
exports.genre_postDelete = function(req, res, next) {
    async.parallel({
		genre:function(cb){
			Genre.findById(req.params.id)
			.exec(cb)
		},
		genre_books:function(cb){
			Book.find({'genre':req.params.id})
			.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		if(results.genre_books>0){
			res.render('genre_delete',{title:"Delete Genre",genre:results.genre,genre_books:results.genre_books})
			return
		}else{
			Genre.findByIdAndRemove(req.params.id,function(err){
				if(err){return next(err)}
				res.redirect('/genre')
			})
		}
	})
}
// Display Genre update form on GET
exports.genre_getUpdate=function(req,res,next){
	req.sanitize('id').escape()
	req.sanitize('id').trim()
	Genre.findById(req.params.id,function(err,genre){
		if(err) return next(err)
		res.render('genre_update',{title:'Update Genre',genre:genre})	
	})
}
// Handle Genre update on POST
exports.genre_postUpdate=function(req,res,next){
	req.sanitize('id').escape()
	req.sanitize('id').trim()
	
	req.checkBody('name','Genre must not be empty.').notEmpty()
	req.sanitize('name').escape()

	
	var errors=req.validationErrors()
	var genre=new Genre({
		name:req.body.name,
		_id:req.params.id
	})
	if(errors){
	    return res.render('genre_update',{title:'Update Genre',genre:genre,errors:errors})	
	}else{
		Genre.findByIdAndUpdate(req.params.id,genre,{},function(err,genre){
			if(err) return next(err)
			res.redirect(genre.url)
		})
	}
}
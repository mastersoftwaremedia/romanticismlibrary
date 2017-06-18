var Author=require('../models/author')
var Book=require('../models/book')
var async=require('async')

//Display list of all authors
exports.authorList=function(req,res,next){
	Author.find()
		.sort([['family_name','ascending']])
		.exec(function(err,author_list){
			if(err){return next(err)}
			res.render('author_list',{title:'List of Authors',author_list:author_list})
		})
}
//Display detail page for a specific author
exports.authorDetail=function(req,res,next){
	async.parallel({
		author:function(cb){
			Author.findById(req.params.id)
				.exec(cb)
		},
		author_books:function(cb){
			Book.find({'author':req.params.id},'title summary')
				.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		res.render('author_detail',{title:'',author:results.author,author_books:results.author_books})
	})
}
//Display Author create form on GET
exports.author_getCreate=function(req,res,next){
	res.render('author_create',{title:'Create Author'})
}
//Handle Author create on POST
exports.author_postCreate=function(req,res,next){
	req.checkBody('first_name','First name must not be empty').notEmpty()
	req.checkBody('first_name','First name must be alphanumeric text.').isAlpha()
	req.checkBody('family_name','Family name must not be empty').notEmpty()
	req.checkBody('family_name','Family name must be alphanumeric Characters').isAlpha()
	req.checkBody('date_of_birth','Invalid date').optional({checkFalsy:true}).isDate()
	req.checkBody('date_of_death','Invalid date').optional({checkFalsy:true}).isDate()
	req.checkBody('imgurl','Image must not be empty').notEmpty()
	
	req.sanitize('first_name').escape()
	req.sanitize('family_name').escape()
	req.sanitize('first_name').trim()
	req.sanitize('family_name').trim()
	req.sanitize('date_of_birth').toDate()
	req.sanitize('date_of_death').toDate()
	
	var errors=req.validationErrors()
	
	var author=new Author({
		first_name:req.body.first_name,
		family_name:req.body.family_name,
		date_of_birth:req.body.date_of_birth,
		date_of_death:req.body.date_of_death,
		imgurl:req.body.imgurl
	})
	if(errors){
		return res.render('author_create',{title:'Create Author',author:author,errors:errors})
	}else{
		author.save(function(err){
			if(err){return next(err)}
			res.redirect(author.url)
		})
	}
}
//Display Author delete form on GET
exports.author_getDelete=function(req,res,next){
	async.parallel({
		author:function(cb){
			Author.findById(req.params.id)
				.exec(cb)
		},
		authors_books:function(cb){
			Book.find({'author':req.params.id})
				.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		res.render('author_delete',{title:"Delete Author", author:results.author, author_books:results.authors_books})
	})
}
//Handle Author delete on POST
exports.author_postDelete=function(req,res,next){
	//req.checkBody('authorid','Author Id must exist').notEmpty()
	async.parallel({
		author:function(cb){
			Author.findById(req.params.id)
				.exec(cb)
		},
		authors_books:function(cb){
			Book.find({'author':req.params.id},'title summary')
				.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		//if success
		if(results.authors_books>0){
			//author has books. render in the same way as for get route.
			res.render('author_delete',{title:'Delete Author',author:results.author, author_books: results.authors_books})
			return
		}else{
			//author has no books. delete object and redirect to the lis of authors.
			Author.findByIdAndRemove(req.params.id,function(err){
				if(err){return next(err)}
				//if success get to the author list
				res.redirect('/author')
			})
		}
	})
}
//Display Author update form on GET
exports.author_getUpdate=function(req,res,next){
	req.sanitize('id').escape()
	req.sanitize('id').trim()
	Author.findById(req.params.id,function(err,author){
		if(err) return next(err)
		res.render('author_update',{title:'Update Author',author:author})
	})
}
//Handle Author update on POST
exports.author_postUpdate=function(req,res,next){
	req.sanitize('id').escape()
	req.sanitize('id').trim()
	
	req.checkBody('first_name','First name must not be empty.').notEmpty()
	req.checkBody('first_name','First name must be alphanumeric text.').isAlpha()
	req.checkBody('family_name','Family name must not be empty.').notEmpty()
	req.checkBody('family_name','Family name must be alphanumeric text.').isAlpha()
	req.checkBody('date_of_birth','Invalid Date').optional({checkFalsy:true}).isDate()
	req.checkBody('date_of_death','Invalid Date').optional({checkFalsy:true}).isDate()
	req.checkBody('imgurl','Image must not be empty').notEmpty()
	
	req.sanitize('first_name').escape()
	req.sanitize('family_name').escape()
	req.sanitize('first_name').trim()
	req.sanitize('family_name').trim()
	req.sanitize('date_of_birth').toDate()
	req.sanitize('date_of_death').toDate()

	var errors=req.validationErrors()
	var author=new Author({
		first_name:req.body.first_name,
		family_name:req.body.family_name,
		date_of_birth:req.body.date_of_birth,
		date_of_death:req.body.date_of_death,
		imgurl:req.body.imgurl,
		_id:req.params.id
	})
	if(errors){
		return res.render('author_update',{title:'Update Author', author:author, errors:errors})
	}else{
		Author.findByIdAndUpdate(req.params.id,author,{},function(err,author){
			if(err) return next(err)
			res.redirect(author.url)
		})
	}
}








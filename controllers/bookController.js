var Book = require('../models/book')
var Author=require('../models/author')
var Genre=require('../models/genre')
var async=require('async')

// Display list of all books
exports.bookList=function(req,res,next){
	async.parallel({
		books:function(cb){     
			Book.find({},'title author imgurl isbn')
			.sort([['title','ascending']])
			.populate('author')
			.exec(cb)
		}
	},function(err, results){
		if(err){return next(err)}
		res.render('book_list',{title:'List of Novels', books: results.books})
	})
}
// Display detail page for a specific book
exports.bookDetail=function(req,res,next){
	async.parallel({
		book:function(cb){     
			Book.findById(req.params.id)
			.populate('author')
			.populate('genre')
			.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		//Successful, so render
		res.render('book_detail',{title:'', book:results.book})
	})
}
// Display book create form on GET
exports.book_getCreate=function(req,res,next){
    async.parallel({
		authors:function(cb){
			Author.find(cb)
		},
		genres:function(cb){
			Genre.find(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		res.render('book_create',{title:'Create Novel', authors:results.authors, genres:results.genres})
	})
}
// Handle book create on POST
exports.book_postCreate=function(req,res,next){
    req.checkBody('title', 'Title must not be empty').notEmpty()
    req.checkBody('author', 'Author must not be empty').notEmpty()
    req.checkBody('summary', 'Summary must not be empty').notEmpty()
    req.checkBody('isbn', 'ISBN must not be empty').notEmpty()
	req.checkBody('imgurl', 'Image must not be empty').notEmpty()
    
    req.sanitize('title').escape()
    req.sanitize('author').escape()
    req.sanitize('summary').escape()
    req.sanitize('isbn').escape()

    req.sanitize('title').trim()     
    req.sanitize('author').trim()
    req.sanitize('isbn').trim()
    req.sanitize('genre').escape()

    var book=new Book({
        title: req.body.title, 
        author: req.body.author, 
        summary: req.body.summary,
        isbn: req.body.isbn,
		imgurl: req.body.imgurl,
        genre:(typeof req.body.genre==='undefined')?[]:req.body.genre.split(",")
    })
    var errors=req.validationErrors()
    if(errors){
        // Some problems so we need to re-render our book
        //Get all authors and genres for form
        async.parallel({
            authors:function(cb) {
                Author.find(cb)
            },
            genres:function(cb) {
                Genre.find(cb)
            },
        }, function(err,results){
            if(err){return next(err)}
            // Mark our selected genres as checked
            for(i=0; i<results.genres.length; i++){
                if (book.genre.indexOf(results.genres[i]._id) === -1) {
                    //Current genre is selected. Set "checked" flag.
                    results.genres[i].checked='true'
                }
            }
            res.render('book_create',{title:'Create Novel', authors:results.authors, genres:results.genres, book:book, errors:errors})
        })
    }else{
    // Data from form is valid.
    // We could check if book exists already, but lets just save.
        book.save(function(err){
            if(err){return next(err)}
            //successful - redirect to new book record.
            res.redirect(book.url)
        })
    }
}
// Display book delete form on GET
exports.book_getDelete=function(req,res,next){
    async.parallel({
		book:function(cb){
			Book.findById(req.params.id)
			.populate('author')
			.populate('genre')
			.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		res.render('book_delete',{title:"Delete Novel", book:results.book})
	})
}
// Handle book delete on POST
exports.book_postDelete = function(req, res, next) {
    //req.checkBody('bookid','Book Id must exist').notEmpty()
	//req.body.bookid
	async.parallel({
		book:function(cb){
			Book.findById(req.params.id)
			.populate('author')
			.populate('genre')
			.exec(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		Book.findByIdAndRemove(req.params.id,function(err){
			if(err){return next(err)}
			res.redirect('/book')
		})
	})
}
// Display book update form on GET
exports.book_getUpdate=function(req,res,next){
    req.sanitize('id').escape()
	req.sanitize('id').trim()
	//Get book,authors and genres for form
	async.parallel({
		book:function(cb){
			Book.findById(req.params.id)
			.populate('author')
			.populate('genre')
			.exec(cb)
		},
		authors:function(cb){
			Author.find(cb)
		},
		genres:function(cb){
			Genre.find(cb)
		}
	},function(err,results){
		if(err){return next(err)}
		//mark out selected genres as checked
		for(var all_g=0; all_g<results.genres.length; all_g++){
			for(var inbook_g=0; inbook_g<results.book.genre.length;inbook_g++){
				if(results.genres[all_g]._id.toString()==results.book.genre[inbook_g]._id.toString()){
					results.genres[all_g].checked="true"
				}
			}
		}
		res.render('book_update',{title:'Update Novel', authors:results.authors, genres:results.genres, book:results.book})
	})
}
// Handle book update on POST
exports.book_postUpdate=function(req,res,next){
    //sanitize id passed in
	req.sanitize('id').escape()
	req.sanitize('id').trim()
	
	//check other data
	req.checkBody('title','Title must not be empty.').notEmpty()
	req.checkBody('author', 'Author must not be empty').notEmpty()
    req.checkBody('summary', 'Summary must not be empty').notEmpty()
    req.checkBody('isbn', 'ISBN must not be empty').notEmpty()
	req.checkBody('imgurl', 'Image must not be empty').notEmpty()
	
    req.sanitize('title').escape()
    req.sanitize('author').escape()
    req.sanitize('summary').escape()
    req.sanitize('isbn').escape()
	
    req.sanitize('title').trim()
    req.sanitize('author').trim() 
    req.sanitize('isbn').trim()
	req.sanitize('genre').escape()

	var book=new Book({
		title:req.body.title,
		author:req.body.author,
		summary:req.body.summary,
		isbn:req.body.isbn,
		imgurl:req.body.imgurl,
		genre:(typeof req.body.genre==='undefined')?[]:req.body.genre.split(","),
		_id:req.params.id //This is REQUIED, or a new ID will be assigned
	})
	
	var errors=req.validationErrors()
	if(errors){
		//re-render book with error info
		//get all authors and genres for form again
		async.parallel({
			authors:function(cb){
				Author.find(cb)
			},
			genres:function(cb){
				Genre.find(cb)
			}
		},function(err,results){
			if(err){return next(err)}
			//mark our selected genres as checked
			for(var i=0; i<results.genres.length; i++){
				if(book.genre.indexOf(results.genres[i]._id) > -1){
					results.genres[i].checked="true"
				}
			}
			res.render('book_update',{title:'Update Novel', authors:results.authors, genres:results.genres, book:book, errors:errors})
		})
	}else {
        // Data from form is valid. Update the record.
        Book.findByIdAndUpdate(req.params.id,book,function(err,book){
            if(err){return next(err)}
			//successful - redirect to book detail page.
			res.redirect(book.url)
		})
    }
}

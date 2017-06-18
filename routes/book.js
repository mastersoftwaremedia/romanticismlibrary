var express = require('express')
var router = express.Router()
var book = require('../controllers/bookController')

//BOOK ROUTES//
/*GET requrest for creating a Book. Note: This must come 
before routes that display Book(uses id)*/
router.get('/create',book.book_getCreate)
/*POST request for creating Book.*/
router.post('/create',book.book_postCreate)

/*GET request to delete Book.*/
router.get('/:id/delete',book.book_getDelete)
/*POST request to delete Book.*/
router.post('/:id/delete',book.book_postDelete)

/*GET request to update Book.*/
router.get('/:id/update',book.book_getUpdate)
/*POST request to update Book.*/
router.post('/:id/update',book.book_postUpdate)

/*GET request for one Book.*/
router.get('/:id',book.bookDetail)
/*GET request for list of all Book Items.*/
router.get('/',book.bookList)

module.exports = router
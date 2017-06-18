var express = require('express')
var router = express.Router()
var author = require('../controllers/authorController')

//AUTHOR ROUTES//
/*GET request for creating Author. Note this must come before 
route for id(display author)*/
router.get('/create',author.author_getCreate)
/*POST request fro creating Author.*/
router.post('/create',author.author_postCreate)

/*GET request to delete Author.*/
router.get('/:id/delete',author.author_getDelete)
/*POST request to delete Author.*/
router.post('/:id/delete',author.author_postDelete)

/*GET request to update Author.*/
router.get('/:id/update',author.author_getUpdate)
/*POST request to update Author.*/
router.post('/:id/update',author.author_postUpdate)

/*GET request for one Author.*/
router.get('/:id',author.authorDetail)
/*GET request for list of all Authors.*/
router.get('/',author.authorList)

module.exports = router
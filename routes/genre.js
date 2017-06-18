var express = require('express')
var router = express.Router()
var genre = require('../controllers/genreController')

//GENRE ROUTES//
/*GET request for creating a Genre. This must come before 
route that displays Genre that uses ID */
router.get('/create',genre.genre_getCreate)
/*POST request for creating Genre.*/
router.post('/create',genre.genre_postCreate)

/*GET request to delete Genre.*/
router.get('/:id/delete',genre.genre_getDelete)
/*POST request to delete Genre.*/
router.post('/:id/delete',genre.genre_postDelete)

/*GET request to update Genre.*/
router.get('/:id/update',genre.genre_getUpdate)
/*POST request to update Genre.*/
router.post('/:id/update',genre.genre_postUpdate)

/*GET request for one Genre.*/
router.get('/:id',genre.genreDetail)
/*GET request for list of all Genre.*/
router.get('/',genre.genreList)

module.exports = router

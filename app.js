var express = require('express')
var path = require('path')
var logger = require('morgan')
var passport=require('passport')
var LocalStrategy=require('passport-local').Strategy
var flash=require('connect-flash')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var expressValidator=require('express-validator')
var session=require('express-session')
var mongoose=require('mongoose')
require('dotenv').config()

var index = require('./routes/index')
var author=require('./routes/author')
var book=require('./routes/book')
var genre=require('./routes/genre')
var compression=require('compression')
var helmet=require('helmet')

var app = express()
app.use(helmet())
//Setup default mongoose connection
var port=process.env.PORT||'3000'
mongoose.connect(process.env.DB_URL,function(err,res){
	if(err) console.log('DB CONNECTION FAILED.')
	else console.log('DB CONNECTION ESTABLISHED.'+port)
})

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(cookieParser())
app.use(compression())
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
	secret:"sessionworkingnow",
	resave:true,
	saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
require('./config/passport')(passport)

app.use(function(req,res,next){
	res.locals.login=req.isAuthenticated()
	res.locals.user=req.user
	res.locals.errors=req.flash('errors')
	next()
})

app.use('/', index)
app.use('/author',author)
app.use('/book', book)
app.use('/genre', genre)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app

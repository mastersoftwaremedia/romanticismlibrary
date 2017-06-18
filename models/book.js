var mongoose=require('mongoose')

var BookSchema=new mongoose.Schema({
	title:{type: String, required:true},
	author:{type: mongoose.Schema.Types.ObjectId, ref:'Author', required:true},
	summary:{type: String, required:true},
	isbn:{type: String, required:true},
	imgurl:{type:String, required:true},
	genre:[{type: mongoose.Schema.Types.ObjectId, ref:'Genre'}]
})

//Virtual for book's URL
BookSchema
.virtual('url')
.get(function(){
	return '/book/'+this._id
})
module.exports=mongoose.model('Book', BookSchema)
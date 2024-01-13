const mongoose=require( 'mongoose' );
const validator=require( "validator" );  // 3rd part validation package
// const slugify=require( "slugify" );
// const bcrypt=require( 'bcryptjs' );
// const crypto=require( 'crypto' );



//Optimize:  ************************** post Modal Schema ******************************
const postSchema=new mongoose.Schema( {
  title: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    trim:true
  },

  file: {
    type:String
  },

  veteran: {
    type: mongoose.Schema.ObjectId,
    ref: "Veteran",
    required:[true,"You are not logged in!!!!!"]
  }




}, {
  // TO SEE VIRTUAL FIELDS 
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  },

} );




//Todo: ************************** Adding virtual properties ******************************
// ***** Whatever return will be set to virtual property value
// postSchema.virtual( 'nickName' ).get( function () {
//   return this.name.slice(0,3);
// } )





//Todo: ************************** Document/query/aggregation middlewares ******************************

// ******** DOCUMENT MIDDLEWARE: runs before .save() and .create()
postSchema.pre( 'save', async function ( next ) {
  // HERE 'this' keyword === current document 


  next();
} )


// ******** QUERRY MIDDLEWARE: runs before executing any find query
postSchema.pre( /^find/, async function ( next ) {
  // HERE 'this' keyword === querry Obj



  next();
} )


// ******** AGGREGATION MIDDLEWARE: runs before executing Agrregation pipepline
postSchema.pre( 'aggregate', async function ( next ) {
    // HERE 'this' keyword === aggregation Obj



  next();
} )




//TODO:  ************************** instance methods of documents ******************************


postSchema.methods.checkName=async function () {
  return ""; // return anything based on logic
}


const Post=mongoose.model( 'Post', postSchema );


module.exports=Post;
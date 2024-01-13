const mongoose=require( 'mongoose' );
const validator=require( "validator" ); 


//Optimize:  ********* Invitation Modal Schema ***********
const InvitationSchema=new mongoose.Schema( {
  eventID:{
    type: mongoose.Schema.ObjectId,  
    ref:'Event',
} ,

  veteranID:{
    type: mongoose.Schema.ObjectId,  
    ref:'Veteran',
  }
,
sendingTime:{
  type:Date,
  default:Date.now()
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




//Todo: ********* Adding virtual properties ***********
// *** Whatever return will be set to virtual property value
// InvitationSchema.virtual( 'nickName' ).get( function () {
//   return this.name.slice(0,3);
// } )





//Todo: ********* Document/query/aggregation middlewares ***********

// **** DOCUMENT MIDDLEWARE: runs before .save() and .create()
InvitationSchema.pre( 'save', async function ( next ) {
  // HERE 'this' keyword === current document 


  next();
} )


// **** QUERRY MIDDLEWARE: runs before executing any find query
InvitationSchema.pre( /^find/, async function ( next ) {
  // HERE 'this' keyword === querry Obj

   this.populate({path:"eventID"})

  next();
} )


// **** AGGREGATION MIDDLEWARE: runs before executing Agrregation pipepline
InvitationSchema.pre( 'aggregate', async function ( next ) {
    // HERE 'this' keyword === aggregation Obj



  next();
} )




//TODO:  ********* instance methods of documents ***********


InvitationSchema.methods.checkName=async function () {
  return ""; // return anything based on logic
}


InvitationSchema.statics.deleteById = function(_id) {
  return this.deleteOne({ _id: _id })
};

const Invitation=mongoose.model( 'Invitation', InvitationSchema );


module.exports=Invitation;
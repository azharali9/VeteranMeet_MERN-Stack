const mongoose=require( 'mongoose' );
const validator=require( "validator" );  // 3rd part validation package

//Optimize:  ********* Event Modal Schema ***********
const EventSchema=new mongoose.Schema( {
  
  name: {
    type: String,
    required: [ true, "Please enter the name of the event!" ],
    trim: true
  },
  eventTime:{
    type:Date,
    required: [ true, "Please enter the event time!" ],
  },
  eventLink: String,
  eventType:{
    type:String,
    required: [ true, "Please enter the event type!" ],
  },
  eventStars:{
    type:Number,
    required: [ true, "Please enter the number of stars for the event!" ],
    max:5000

  
  },
  hobby:  {
    type: String,
    enum: [ "reading", "traveling", "fishing", "crafting", "television", "bird watching", "collecting", "music", "gardening", "video games" ],
    required: [ true, "Please select a hobby!" ]
} ,
  
  location: {
    type: {
      type: String, 
      enum: ['Point'],
      default:"Point"
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  communityID:{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Community'
   },
  veteranID:{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Veteran'  
  }

},

{
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
// EventSchema.virtual( 'nickName' ).get( function () {
//   return this.name.slice(0,3);
// } )





//Todo: ********* Document/query/aggregation middlewares ***********

// **** DOCUMENT MIDDLEWARE: runs before .save() and .create()
EventSchema.pre( 'save', async function ( next ) {
  // HERE 'this' keyword === current document 


  next();
} )


// **** QUERRY MIDDLEWARE: runs before executing any find query
EventSchema.pre( /^find/, async function ( next ) {
  // HERE 'this' keyword === querry Obj



  next();
} )


// **** AGGREGATION MIDDLEWARE: runs before executing Agrregation pipepline
EventSchema.pre( 'aggregate', async function ( next ) {
    // HERE 'this' keyword === aggregation Obj



  next();
} )




//TODO:  ********* instance methods of documents ***********


EventSchema.methods.checkName=async function () {
  return ""; // return anything based on logic
}


const Event=mongoose.model( 'Event', EventSchema );


module.exports=Event;
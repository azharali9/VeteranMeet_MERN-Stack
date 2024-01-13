const mongoose=require( 'mongoose' );
const validator=require( "validator" );
const bcrypt=require( 'bcryptjs' );
const crypto=require( 'crypto' );

//Optimize:  ************************** Community Modal Schema ******************************
const communitySchema=new mongoose.Schema( {
    name: {
        type: String,
        required: [ true, "Enter the community name!" ],
        trim: true
    },

    email: { // Identifying Community by email
        type: String,
        unique: [ true, "community with this email already exist" ],
        required: [ true, "Please provide your email" ],
        trim: true,
        lowercase: true,
        validate: [ validator.isEmail, "Please provide valid email" ]

    },

    phone: { 
        type: String,
        required: [ true, "Please provide your phone" ],
    },
    type:{
      type: String,
      enum: [ "organization", "Educational institute", "NGO" ],
      required: [ true, "Please provide your email" ],
    
    },
    password: {
        type: String,
        required: [ true, 'Please provide your password' ],
        minLength: [ 4, "Password must be of at least 4 characters long" ],
        select: false
    },

    passwordConfirm: {
        type: String,
        required: [ true, 'Please confirm your password' ],
        validate: {
            validator: function ( val ) {
                return val===this.password
            },
            message: "Password and Confirm-password are not same!"
        }
    },


} ,
{
    // TO SEE VIRTUAL FIELDS 
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },

});



// communitySchema.virtual( 'createdEvents',{
//     ref:"Event",
//     localField:"_id",
//     foreignField:"communityID"
// } )



//Todo: ************************** Document/query/aggregation middlewares ******************************
communitySchema.pre( 'save', async function ( next ) {
    // Function runs only when we are modifying password field or on creating new community
    if ( !this.isModified( 'password' ) ) return next();
    // Encrypting the password before saving it to database 
    this.password=await bcrypt.hash( this.password, 12 );
    this.passwordConfirm=undefined;
    next();
} )
communitySchema.methods.correctPassword=async function ( communityPassword, encryptedPassword ) {
    return await bcrypt.compare( communityPassword, encryptedPassword );
}
const Community=mongoose.model( 'Community', communitySchema );


module.exports=Community;


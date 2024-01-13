const mongoose=require( 'mongoose' );
const validator=require( "validator" );
const bcrypt=require( 'bcryptjs' );
const crypto=require( 'crypto' );







//Optimize:  ************************** User Modal Schema ******************************
const veteranSchema=new mongoose.Schema( {
    firstName: {
        type: String,
        required: [ true, "Enter first name!" ],
        trim: true
    },
    lastName: {
        type: String,
        required: [ true, "Enter last name!" ],
        trim: true
    },
    gender: {
        type: String,
        enum: [ 'male', "female" ],


    },
    address: {
        type: String,
        required: [ true, "Please enter your address" ]
    },
    email: { // Identifying users by email
        type: String,
        unique: [ true, "User with this email already exist" ],
        required: [ true, "Please provide your email" ],
        trim: true,
        lowercase: true,
        validate: [ validator.isEmail, "Please provide valid email" ]

    },
    phone: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    password: {
        type: String,
        required: [ true, 'Please provide your password' ],
        minLength: [ 4, "Password must be of atleast 4 characters long" ],
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

    hobbies: [ {
        type: String,
        enum: [ "reading", "traveling", "fishing", "crafting", "television", "bird watching", "collecting", "music", "gardening", "video games" ],
        required: [ true, "Please add some hobbies!" ]
    } ],

    profession: {
        type: String,
        required: [ true, "Please enter your profession!" ]
    },
    followed: [ {
        type: mongoose.Schema.ObjectId,
    } ],
    stars: {
        type: Number,
        default: 1,
    },
    interestedEvents: [ {
        type: mongoose.Schema.ObjectId,
        ref: 'Event'
    } ],


    // changePasswordAt: Date,

    // passwordResetToken: String,

    // passwordResetTokenExpires: Date,



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



veteranSchema.virtual( 'Posts', {
    ref: "Post",
    localField: "_id",
    foreignField: "veteran"
} )

veteranSchema.virtual( 'createdEvents', {
    ref: "Event",
    localField: "_id",
    foreignField: "veteranID"
} )

veteranSchema.virtual( 'invitations', {
    ref: "Invitation",
    localField: "_id",
    foreignField: "veteranID"
} )




//Todo: ************************** Adding virtual properties ******************************
// ***** Whatever return will be set to virtual property value
veteranSchema.virtual( 'badge' ).get( function () {

    if ( this.stars>=25000 ) { return 'Silver' }
    else if ( this.stars>=40000 ) { return "Ruby" }
    else if ( this.stars>=50000 ) { return "Golden" }
    else if ( this.stars>=60000 ) { return "Diamond" }
    else if ( this.stars>=65000 ) { return "Sapphire" }
    else if ( this.stars>=70000 ) { return "Platinum" }
    else if ( this.stars>=100000 ) { return "Eternal" }



} )



//Todo: ************************** Document/query/aggregation middlewares ******************************
veteranSchema.pre( 'save', async function ( next ) {
    // Function runs only when we are modifying password field or on creating new user
    if ( !this.isModified( 'password' ) ) return next();
    console.log( "hi from document", this )
    // Encrypting the password before saving it to database 
    this.password=await bcrypt.hash( this.password, 12 );
    this.passwordConfirm=undefined;
    next();
} )

// veteranSchema.pre( /^find/, function ( next ) {

//     this.populate( { path: "Posts" } )
//     next()
// } )
// veteranSchema.pre( /^find/, function ( next ) {

//     this.populate( { path: "invitations" } )
//     next()
// } )

// veteranSchema.pre( /^find/, function ( next ) {
//     // this.find( {
//     //     active: true
//     // } );
//     next()
// } )



//Fix:  ************************** instance methods of documents ******************************

//Fix:Function to check password entered by user and encrypted password in db are same
veteranSchema.methods.correctPassword=async function ( userPassword, encryptedPassword ) {
    return await bcrypt.compare( userPassword, encryptedPassword );
}

//Fix:Function to check if user has changed the password after sign in is generated
// veteranSchema.methods.changePasswordAfter=function ( jwtTimestamp ) {
//     if ( this.changePasswordAt ) {
//         const changePasswordTimestamp=parseInt( this.changePasswordAt/1000, 10 );
//         return jwtTimestamp<changePasswordTimestamp //200<300
//     }
//     return false;

// }

//Fix:Funtion to create reset-token and put that in databse of particular user
// veteranSchema.methods.createResetToken=function () {

//     const resetToken=crypto.randomBytes( 32 ).toString( 'hex' );

//     this.passwordResetToken=crypto.createHash( 'sha256' ).update( resetToken ).digest( 'hex' );
//     this.passwordResetTokenExpires=Date.now()+( 10*60*1000 );
//     // console.log( "the encrypted resetToken in db 😎😎: ", this.passwordResetToken )

//     return resetToken;
// }

const Veteran=mongoose.model( 'Veteran', veteranSchema );


module.exports=Veteran;





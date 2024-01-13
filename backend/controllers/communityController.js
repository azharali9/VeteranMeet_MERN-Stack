const Community=require( "../models/communityModel" );
const catchAsync=require( "../utils/catchAysnc" );
const AppError=require( "../utils/appError" );
const factory=require( './FactoryHandler' );


//Todo:  ************************** helper functuions ******************************

const filterObject=( obj, ...fields ) => {
    // eslint-disable-next-line prefer-const
    let newObj={};

    Object.keys( obj ).forEach( el => {
        if ( fields.includes( el ) ) {
            newObj[ el ]=obj[ el ];
        }
    } )
    return newObj;
}

//TODO: Maybe remove this later
exports.updateMe=catchAsync( async ( req, res, next ) => {

    // console.log(req.body);


    //? (1) Create error if Community POSTs password data
    if ( req.body.password||req.body.passwordConfirm ) {
        return next( new AppError( "This URL is not for password updates. Please go to /updateMyPassword", 400 ) );
    }


    //? (2) Filtered out unwanted field names that are not allowed to be updated
    const filteredObj=filterObject( req.body, 'name', 'email','events' );
    // console.log( req.file );
    // if ( req.file ) filteredObj.photo = req.file.filename;

    //? (3) update Community document
    const updatedCommunity=await Community.findByIdAndUpdate( req.Community._id, filteredObj, {
        new: true,
        // runValidators: true
    } )

    res.status( 201 ).json( {
        status: "success",
        Community: updatedCommunity
    } )

} )

//Fix: delete curently logged in Community
exports.deleteMe=catchAsync( async ( req, res, next ) => {
    //? (1) get the current Community document by id and set its active property to false
    await Community.findByIdAndUpdate( req.Community._id, {
        active: false
    } )

    //? (2) Send the delete response with 204 code
    res.status( 204 ).json( {
        status: "success",
        data: null
    } )
} )




exports.getAllCommunities=catchAsync( async ( req, res, next ) => {

    // ! EXECUTE TlHE QUERRY
    let docs=await Community.find().populate({ path: "createdEvents" } );


    // ! SENDING THE REPONSE
    res.status( 200 ).json( {
        status: 'success',
        results: docs.length,
        data: {
            data: docs
        }
    } );

} );

// FIX: get single Community basaed on id
exports.getCommunity=factory.getOne( Community,"createdEvents" );

// FIX: delete Community based on id (By Admins)
exports.deleteCommunity=factory.deleteOne( Community );





// const User=require( "../models/userModel" );
const catchAsync=require( "../utils/catchAysnc" );
const AppError=require( "../utils/appError" );
const factory=require( './FactoryHandler' );
const multer=require( 'multer' );
const sharp=require( 'sharp' );
const Post=require( "../models/postModel" );


//Todo:  ************************** helper functuions ******************************


//FIX: Image uploading functionality
// const multerStorage=multer.diskStorage( {
//     destination: ( req, file, cb ) => {
//         cb( null, 'public/img/users')
//     },
//     filename: ( req, file, cb ) => {
//         const extension = file.mimetype.split( '/' )[ 1 ];
//         cb( null, `user-${req.user._id}-${Date.now()}.${extension}` );
//     }
// })


const multerStorage = multer.memoryStorage();

const multerFilter=( req, file, cb ) => {
  console.log( "=>>>", file )
    if ( file.mimetype.startsWith( 'image' ) ) {
        // console.log("=>>>>", file );
        req.file=file;
        cb( null, true )
    }
    else {
        cb( new AppError( "Only image file can be uploaded", 400 ),false );
    }
}

const upload = multer( {
    storage: multerStorage,
    fileFilter:multerFilter
} ); // save the file got from form in respective destination





exports.uploadPostPhoto=upload.single( 'images' )

exports.resizePostPhoto=( req, res, next ) => {

    // console.log(req.file)
    if ( !req.file ) return next();

    req.file.filename=`user-${req.user._id}-${Date.now()}.jpeg`;

    sharp( req.file.buffer )
        .resize( 500, 500 )
        .toFormat( 'jpeg' )
        .jpeg( { quality: 90 } )
        .toFile( `public/img/posts/${req.file.filename}` );

    // req.body.file=req.file.filename;


    next();

}




exports.createPost=catchAsync( async ( req, res, next ) => {
  
  //? (2) Send the delete response with 204 code

 
  console.log("hi")
  const obj={
    description: req.body.description,
    veteran: req.user._id,
    file:req.file.filename,
  }
  const data=await Post.create( obj );

  
  res.status( 200 ).json( {
    status: "success",
    data
  } )

} )


exports.getPostsOfFollowedPersons=catchAsync( async ( req, res, next ) => {

 

  

  res.status( 200 ).json( {
    status: "success",
    data
  } )

} )








// Optimize: get all 
//exports.getAllData=factory.getAll( Model );

// Optimize: get single data basaed on id
//exports.getSingleData=factory.getOne( Model );

// Optimize: Create  
//exports.createData=factory.createOne( Model );

// Optimize: update based on id 
//exports.updateData=factory.updateOne( Model )

// Optimize: delete  based on id 
//exports.deleteData=factory.deleteOne( Model );
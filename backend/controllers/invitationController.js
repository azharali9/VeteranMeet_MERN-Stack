const Veteran=require( "../models/veteranModel");
const Invitation=require( "../models/invitationModel" );
const catchAsync=require( "../utils/catchAysnc" );
const AppError=require( "../utils/appError" );
const factory=require( './FactoryHandler' );


// Optimize: Create  
exports.sendInvitation=factory.createOne(Invitation);

//Accepting Invitation
exports.acceptInvitation=catchAsync( async ( req, res, next ) => {
  const doc=await Invitation.findById( req.params.id );
  if(!doc) 
  return next( new AppError( "No invitation found", 404 ) )
  const {eventID,veteranID}=doc;
  let newInterestedEvents=( await Veteran.findById( veteranID ).select( 'interestedEvents' ) ).interestedEvents;
    newInterestedEvents.push( eventID._id )
    await Veteran.findByIdAndUpdate( veteranID, { interestedEvents: newInterestedEvents } );

    await Invitation.deleteById(req.params.id);


  //? (2) Send the delete response with 204 code
  res.status( 200 ).json( {
    status: "success",
     
  } )

} )

exports.rejectInvitation=catchAsync( async ( req, res, next ) => {
  await Invitation.deleteById(req.params.id)
  //? (2) Send the delete response with 204 code
  res.status( 200 ).json( {
    status: "success",
     
  } )

} )




const Listing = require("../models/listing")


//for index Route 
module.exports.index = async (req,res)=>{
    const allListings =  await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
  };


  // for new Route
  module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
  };


  //for show route
  module.exports.showListing = async (req,res) => {
    let {id}= req.params;
     const listing = await Listing.findById(id).populate({path:"reviews", populate:{path:"author",}}).populate("owner");
     if(!listing){
      req.flash("error"," your requested listing is not exist ");
      res.redirect("/listings");
     }
     console.log(listing)
     res.render("./listings/show.ejs",{listing});
  };


  //for create route 
  module.exports.createListing = async (req,res, next)=>{
     let url = req.file.path;
     let filename = req.file.filename;

    const newListing =  new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
 
  };

 //for edit route
  module.exports.renderEditForm = async (req,res)=>{
    let {id}= req.params;
     const listing = await Listing.findById(id);
     if(!listing){
      req.flash("error"," your requested listing is not exist ");
      res.redirect("/listings");
     }
      let originalImageUrl = listing.image.url;
      originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
     res.render("listings/edit.ejs",{listing, originalImageUrl});

 
  };

//for update route 
  module.exports.updateListing = async (req,res)=>{
    let{id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
     if(typeof req.file !== "undefined"){
     let url = req.file.path;
     let filename = req.file.filename;
     listing.image = {url,filename};
     await listing.save();
     };
     req.flash("success"," Your listing is Updated!");
     res.redirect(`/listings/${id}`)
 
  };

//for delte route
  module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
     let deletedListing = await Listing.findByIdAndDelete(id);
     console.log(deletedListing );
     req.flash("success"," Listing Deleted!");
     res.redirect("/listings");
  };
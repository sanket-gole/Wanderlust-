const Listing = require("../models/listing");
module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("lisitings/index.ejs", { allListings });

};

module.exports.RenderNewForm = (req, res) => {

    res.render("lisitings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    res.render("lisitings/show.ejs", { listing })

};

module.exports.createListing = async(req, res, next) => {
    try {
        if (!req.file) {
            console.log('File not uploaded!');
            throw new Error('File not uploaded');
        }
        const { path: url, filename } = req.file;
        const newListing = new Listing({
            ...req.body.listing,
            image: { url, filename },
            owner: req.user._id,
        });

        await newListing.save();
        req.flash('success', 'New listing created!');
        res.redirect('/listings');
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Extract specific validation errors
            const errorMessages = Object.values(error.errors).map(e => e.message);
            req.flash('error', errorMessages.join('. '));
            res.redirect('/listings/new');
        } else {
            next(error); // Pass other errors to the error handler
        }
    }
};



module.exports.RenderEditform = async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings")
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("lisitings/edit.ejs", { listing, originalImageUrl });
}

module.exports.UpdateListing = async(req, res, next) => {

    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    req.flash("success", " Listing Updated!");
    res.redirect(`/listings/${id}`);

};

module.exports.destroyListing = async(req, res) => {
    let { id } = req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success", "listing Deleted!");
    res.redirect("/listings");
};
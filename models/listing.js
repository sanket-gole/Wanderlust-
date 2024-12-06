const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;


const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category: { // New field
        type: String,
        enum: ['Apartment', 'House', 'Cottage', 'Villa', 'apartment', 'house', 'cottage', 'villa'], // Optional: Restrict to specific values
        required: true // Make this field mandatory
    },
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }


});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');



// Ensure environment variables are loaded and available
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderLust_DEV',
        allowerdFormats: ['jpeg', 'png', 'jpg'], // Fix any typos (e.g., 'allowerdFormats')
    },
});

module.exports = {
    cloudinary,
    storage,
};
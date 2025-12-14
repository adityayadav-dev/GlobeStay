const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_CODE  
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'GlobeStay_DEV',
    allowed_formats: ['jpeg', 'png', 'jpg']
  }
});

module.exports = { cloudinary, storage };

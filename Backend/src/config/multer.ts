import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.config';

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "uploads/images",
        format: file.mimetype.split('/')[1] || "jpg",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
        resource_type: "image"
    })
});

const upload = multer({ storage });

export default upload;
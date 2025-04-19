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
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith('video/');
        
        return {
            folder: isVideo ? 'uploads/videos' : 'uploads/images',
            format: file.mimetype.split('/')[1],
            resource_type: isVideo ? 'video' : 'image',
            ...(isVideo ? {} : {
                transformation: [{ width: 500, height: 500, crop: "limit" }]
            })
        };
    }
});

// Add file filter to restrict file types
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
    
    if ([...allowedImageTypes, ...allowedVideoTypes].includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and videos are allowed.'), false);
    }
};

// Configure multer with size limits
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
    }
});

export default upload;
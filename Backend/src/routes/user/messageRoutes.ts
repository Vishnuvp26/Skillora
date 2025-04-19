import express from 'express';
import upload from '../../config/multer';

const router = express.Router();

router.post('/upload', upload.single('media'), async (req, res):Promise<void>=> {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        res.json({ 
            mediaUrl: req.file.path,
            mediaType: req.file.mimetype.startsWith('video/') ? 'video' : 'image'
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

export default router;
import express from 'express';
import upload from '../utils/multer.js';
import { uploadMedia } from '../utils/cloudinary.js';
import fs from 'fs'
const router = express.Router();

router.post('/upload-video',upload.single('file'),async (req,res) =>{
    try {
      const result = await uploadMedia(req.file.path);
            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting file', err);
                } else {
                    console.log('Temporary image deleted successfully.');
                }
            });                    
       res.status(200).json({ message: 'Video uploaded successfully', data: result,success: true });
        
    } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error uploading video' });
    }
})

export default router;
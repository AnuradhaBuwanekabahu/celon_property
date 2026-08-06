import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'uploads/';
        
        if (file.fieldname === 'property_image' || file.fieldname === 'main_image') {
            folder += 'properties/';
        } else if (file.fieldname === 'ad_image') {
            folder += 'ads/';
        } else {
            folder += 'general/';
        }
        
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const filename = `${crypto.randomUUID()}${ext}`;
        cb(null, filename);
    }
});

// File filter - Only allow images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type. Only ${allowedTypes.join(', ')} allowed.`), false);
    }
};

// Create multer instance
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: fileFilter
});

export const uploadSingle = (fieldName) => upload.single(fieldName);
export const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);
export const uploadFields = (fields) => upload.fields(fields);

export default upload;
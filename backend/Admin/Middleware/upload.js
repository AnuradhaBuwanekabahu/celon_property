import multer from "multer";

const storage = multer.memoryStorage();

const upload = multer({

    storage,

    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for videos
    },

    fileFilter: (req, file, cb) => {

        const allowedImages = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const isImage = allowedImages.includes(file.mimetype);
        const isVideo = file.mimetype.startsWith("video/");

        if (isImage || isVideo) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG, WEBP images and videos are allowed"));
        }
    }

});

export default upload;
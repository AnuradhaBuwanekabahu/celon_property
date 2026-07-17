import multer from "multer";


const storage = multer.memoryStorage();


const upload = multer({

    storage: storage,

    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];


        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPG, PNG, WEBP images are allowed"));
        }

    }

});


export default upload;
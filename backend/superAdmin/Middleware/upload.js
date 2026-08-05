import multer from "multer";


// Store files temporarily in memory
const storage = multer.memoryStorage();



const upload = multer({

    storage,


    limits: {

        // 100MB for property videos

        fileSize: 100 * 1024 * 1024

    }

});



export default upload;
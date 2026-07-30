import multer from "multer";


// Store files temporarily in memory
const storage = multer.memoryStorage();



const upload = multer({

    storage,


    limits: {

        // 100MB for property videos

        fileSize: 100 * 1024 * 1024

    },


    fileFilter:(req,file,cb)=>{


        const allowedImages = [

            "image/jpeg",
            "image/png",
            "image/webp"

        ];



        const allowedVideos = [

            "video/mp4",
            "video/mpeg",
            "video/webm",
            "video/quicktime"

        ];



        const isImage = allowedImages.includes(

            file.mimetype

        );


        const isVideo = allowedVideos.includes(

            file.mimetype

        );




        if(isImage || isVideo){


            cb(null,true);


        }
        else{


            cb(

                new Error(

                    "Only JPG, PNG, WEBP images and MP4 videos are allowed"

                ),

                false

            );


        }



    }


});



export default upload;
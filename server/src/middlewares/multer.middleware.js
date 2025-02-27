import multer from "multer"

const storage = multer.diskStorage({
    Destination: function (req, res, cb){
        cb(null, './public/temp')

    },
    filename: function (req, res, cb){
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null, file.originalname) 
    }
})

export const upload = multer({
    storage
})
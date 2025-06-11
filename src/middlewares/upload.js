import multer from "multer";

const storage = multer.diskStorage({
destination: function(req, file, cb){
    cb(null, "");
},
filename: function(req, file, cb){
    cb(null, "");
}
});

export const upload = multer({storage});
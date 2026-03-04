const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 10, //5mb
    }
})
//bytes mein de sakte hain file size ko ... 1024 * 1024 bole to 1mb hojaega ... and isse badi file bheji to error return kar dega ...
// to hum 5mb ka file size allow kar rahe hain :- 1024*1024*5


module.exports = upload;
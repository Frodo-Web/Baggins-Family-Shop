const multer = require('multer');

/*
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
        let extension = '';
        if(file.mimetype === 'image/jpeg') extension = '.jpeg';
        if(file.mimetype === 'image/png') extension = '.png';
        if(file.mimetype === 'image/gif') extension = '.gif';
        if(file.mimetype === 'image/webp') extension = '.webp'
        cb(null, file.fieldname + '-' + Date.now() + (extension !== ''? extension : null ))
    }
});
*/
const storage = multer.memoryStorage()
module.exports = multer({ storage: storage });
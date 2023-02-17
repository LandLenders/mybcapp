import multer from 'multer'
import path from 'path'
import { KeyGen } from '../helpers/global'

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './public/uploads/')
    },
    filename: function(req, file, cb){
        cb(null, KeyGen() + path.extname(file.originalname))
    }
})

const upload = multer({storage})

export default upload
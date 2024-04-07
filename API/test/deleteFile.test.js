import mongoose from 'mongoose'
import deleteFile from '../logic/deleteFile.js'

mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            deleteFile('65e8bd456728f7c2d66bd330', '65eb3629de39ba551ad01d4f')
                .then(() => console.log('file successfully deleted!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
import mongoose from 'mongoose'
import downloadFile from '../logic/downloadFile.js'

mongoose.connect('mongodb://127.0.0.1/hiinit')
    .then(() => {
        try {
            debugger
            downloadFile('65e8c8c89653e312c3490947', '65f0ba1cc5e0a76949692773')
                .then(() => console.log('file successfully download!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
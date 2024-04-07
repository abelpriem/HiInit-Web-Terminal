import mongoose from 'mongoose'
import dotenv from 'dotenv'
import uploadFile from '../logic/uploadFile.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_HIINIT_API)
    .then(() => {
        try {
            uploadFile('65dce2a17bc2a02ac58ef132', 'example.exe', 'file/ejemplo')
                .then(({ user, file }) => console.log('file saved!', { user, file }))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))

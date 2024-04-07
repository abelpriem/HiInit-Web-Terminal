import mongoose from 'mongoose'
import dotenv from 'dotenv'
// import retrieveFiles from '../logic/retrieveFiles.js'
import retrieveFilesWithGroups from '../logic/retrieveFileswithGroups.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_HIINIT_API)
    .then(() => {
        try {
            retrieveFilesWithGroups('65f838f6b2e82c062d64532a')
                .then(files => console.log('files retrieved!', files))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
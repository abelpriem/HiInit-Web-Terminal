import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveUser from '../logic/retrieveUser.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_HIINIT_API)
    .then(() => {
        try {
            retrieveUser('65d0e63fa0232cfaf1c8c411')
                .then(user => console.log('user retrieved!', user))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))

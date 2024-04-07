import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveGuest from '../logic/retrieveGuest.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_HIINIT_API)
    .then(() => {
        try {
            retrieveGuest()
                .then(guest => console.log('guest retrieved!', guest))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))


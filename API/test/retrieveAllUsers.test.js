import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveAllUsers from '../logic/retrieveAllUsers.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_HIINIT_API)
    .then(() => {
        try {
            retrieveAllUsers('65e8c15ef35504a2bcecf912')
                .then(users => console.log('users retrieved!', users))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
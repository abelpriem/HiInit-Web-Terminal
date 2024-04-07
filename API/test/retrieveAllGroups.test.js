import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveAllGroups from '../logic/retrieveAllGroups.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_HIINIT_API)
    .then(() => {
        try {
            retrieveAllGroups('65e8c15ef35504a2bcecf912')
                .then(groups => console.log('groups retrieved!', groups))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveCommands from '../logic/retrieveCommands.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_HIINIT_API)
    .then(() => {
        try {
            retrieveCommands('65e3c59b16e9d4ba324101cf')
                .then(commands => console.log('commands retrieved!', commands))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))


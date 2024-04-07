import mongoose from 'mongoose'
import authenticateUser from '../logic/authenticateUser.js'


mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            authenticateUser('soy@batman.com', '123123123')
                .then(userId => console.log('user logged!', userId))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
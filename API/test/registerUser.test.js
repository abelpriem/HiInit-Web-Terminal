import mongoose from 'mongoose'
import registerUser from '../logic/registerUser.js'

mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            registerUser('Abel', 'abelpriem94@hotmail.com', 'hiinit1215')
                .then(() => console.log('user registered!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
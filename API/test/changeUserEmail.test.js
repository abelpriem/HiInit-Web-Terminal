import mongoose from 'mongoose'
import changeUserEmail from '../logic/changeUserEmail.js'

mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            changeUserEmail('65d7ad5a0477fa56b47795bc', 'nosoy@batman.com', '123123123', '123123123')
                .then(() => console.log('Email changed successfully!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
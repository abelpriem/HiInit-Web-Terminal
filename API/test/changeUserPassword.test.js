import mongoose from 'mongoose'
import changeUserPassword from '../logic/changeUserPassword.js'

mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            changeUserPassword('65d7ad5a0477fa56b47795bc', '123123123', '789789789', '789789789')
                .then(() => console.log('Password changed successfully!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
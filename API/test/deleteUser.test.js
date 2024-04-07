import mongoose from 'mongoose'
import deleteUser from '../logic/deleteUsers.js'

mongoose.connect('mongodb://127.0.0.1/hiinit')
    .then(() => {
        try {
            deleteUser('65e8c15ef35504a2bcecf912', '65f482e677556bf704f13122')
                .then(() => console.log('user successfully deleted!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
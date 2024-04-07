import mongoose from 'mongoose'
import createGroup from '../logic/createGroup.js'

mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            createGroup('65e8c15ef35504a2bcecf912', 'root')
                .then(group => console.log('Group created!', group))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
import mongoose from 'mongoose'
import deleteGroup from '../logic/deleteGroup.js'

mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            deleteGroup('65ff399d48fb8ca30d3f0ca7', '6600648ac98c529a2727f284')
                .then(() => console.log('group successfully deleted!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
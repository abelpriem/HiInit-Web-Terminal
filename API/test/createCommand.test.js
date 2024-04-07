import mongoose from 'mongoose'
import createCommand from '../logic/createCommand.js'

mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            createCommand('65d8a618cabfbe51d07de55f', 'exit')
                .then(command => console.log('Command created!', command))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
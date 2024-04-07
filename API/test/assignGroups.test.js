import mongoose from 'mongoose'
import assignGroups from '../logic/assignGroups.js'

mongoose.connect('mongodb://127.0.0.1:27017/hiinit')
    .then(() => {
        try {
            assignGroups('65e8c15ef35504a2bcecf912', '65ff399d48fb8ca30d3f0ca7', '65ff1c0248fb8ca30d3f0c8b')
                .then(() => console.log('users group changed succesfully!'))
                .catch(error => console.error(error))
        } catch (error) {
            console.log(error)
        }
    })
    .catch(error => console.error(error))
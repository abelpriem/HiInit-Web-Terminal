import { User, Group } from '../data/models.js'
import bcrypt from 'bcrypt'
import { errors } from 'com'
import { validate } from 'com'

const { SystemError, DuplicityError } = errors

async function registerUser(username, email, password) {
    validate.text(username, 'Username')
    validate.email(email, 'Email')
    validate.password(password, 'Password')

    try {
        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username, email, password: hash, group: 'localhost', role: 'user' })

        const group = await Group.findOne({ name: 'localhost' })
        group.members.push(user._id)
        await group.save()

        return user

    } catch (error) {
        if (error.code === 11000) {
            throw new DuplicityError('Account already exist. Try again')
        }

        throw new SystemError(error.message)
    }
}

export default registerUser

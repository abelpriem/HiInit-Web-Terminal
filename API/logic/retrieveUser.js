import { User } from '../data/models.js'
import { errors, validate } from 'com'
const { SystemError, NotFoundError } = errors

export default async function retrieveUser(userId) {
    validate.id(userId, 'ID user')

    try {
        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        delete user._id
        delete user.__v
        delete user.email
        delete user.password

        // USERNAME - GROUP - ROLE 
        return user

    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
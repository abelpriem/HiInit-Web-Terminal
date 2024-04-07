import { User } from '../data/models.js'
import { errors, validate } from 'com'
const { SystemError, NotFoundError, AuthorizationError } = errors

async function retrieveAllUsers(userId) {
    validate.id(userId, 'ID User')

    try {
        const admin = await User.findById(userId).lean()

        if (!admin) {
            throw new NotFoundError('Admin not found. Try again')
        }

        if (admin.role[0] === 'admin') {
            const users = await User.find({ 'role': { $ne: 'admin' } }).lean()

            const usersArray = users.map(user => ({
                id: user._id.toString(),
                username: user.username
            }))

            return usersArray
        } else {
            throw new AuthorizationError('Authorization denied. Only ADMIN user')
        }
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}

export default retrieveAllUsers

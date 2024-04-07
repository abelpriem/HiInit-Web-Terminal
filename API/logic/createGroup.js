import { User, Group } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, AuthorizationError, DuplicityError } = errors

export default async function createGroup(userId, groupName) {
    validate.id(userId, 'ID user')
    validate.text(groupName, 'Group name')

    try {
        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found')
        }

        if (user.role[0] !== 'admin') {
            throw new AuthorizationError('Authorization denied. Only ADMIN user')
        }

        await Group.create({ name: groupName })
    } catch (error) {
        if (error.code === 11000) {
            throw new DuplicityError('Group already exist. Try again')
        }

        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
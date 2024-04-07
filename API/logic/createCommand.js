import { validate, errors } from 'com'
import { User, Command } from '../data/models.js'
const { SystemError, NotFoundError, AuthorizationError, DuplicityError } = errors

export default async function createCommand(userId, commandName) {
    validate.id(userId, 'ID User')
    validate.text(commandName, 'Command name')

    try {
        const user = await User.findById(userId).lean()
        if (!user) {
            throw new NotFoundError('User not found')
        }

        if (user.role[0] === 'admin') {
            const command = await Command.create({ name: commandName })
            return command

        } else {
            throw new AuthorizationError('Authorization denied. Only ADMIN user')
        }
    } catch (error) {
        if (error.code === 11000) {
            throw new DuplicityError('Command already exist. Try again')
        }

        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
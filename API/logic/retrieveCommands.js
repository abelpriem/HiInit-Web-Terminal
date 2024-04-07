import { User, Command } from '../data/models.js'
import { errors, validate } from 'com'
const { SystemError } = errors

export default async function retrieveCommands(userId) {
    validate.id(userId, 'ID user')

    try {
        const user = await User.findById(userId).lean()

        if (!user) {
            return Command.find({ name: { $in: ['help', 'exit', 'login', 'register'] } }).lean().distinct('name')
        }

        return Command.find().lean().distinct('name')
    } catch (error) {
        throw new SystemError(error.message)
    }
}
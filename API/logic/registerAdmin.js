import { User, Group } from '../data/models.js'
import bcrypr from 'bcrypt'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, AuthorizationError } = errors

async function registerAdmin(userId, username, email, password) {
    validate.id(userId, 'ID Admin')
    validate.text(username, 'New ADMIN username')
    validate.email(email, 'New ADMIN email')
    validate.password(password, 'New ADMIN password')

    try {
        const requestAdmin = await User.findById(userId).lean()

        if (!requestAdmin)
            throw new NotFoundError('User not found')

        if (requestAdmin.role[0] !== 'admin')
            throw new AuthorizationError('Authorization denied. Only ADMIN mode')

        const hash = await bcrypr.hash(password, 5)

        const admin = await User.create({ username: username, email: email, password: hash, group: 'root', role: 'admin' })
        const group = await Group.findOne({ name: 'root' });

        group.members.push(admin._id)
        await group.save()

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}

export default registerAdmin
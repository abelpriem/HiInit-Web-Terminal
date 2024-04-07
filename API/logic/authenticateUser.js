import { User } from '../data/models.js'
import bcrypt from 'bcrypt'
import { errors } from 'com'
import { validate } from 'com'
const { SystemError, NotFoundError, CredentialsError } = errors

export default async function authenticateUser(email, password) {
    validate.email(email, 'Email')
    validate.password(password, 'Password')

    try {
        const user = await User.findOne({ email }).lean()
        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new CredentialsError('Wrong credentials. Check again')
        }

        return user._id

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof CredentialsError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
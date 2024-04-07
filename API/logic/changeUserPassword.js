import bcrypt from 'bcrypt'
import { User } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, CredentialsError } = errors

export default async function changeUserPassword(userId, password, newPassword, againNewPassword) {
    validate.id(userId, 'ID User')
    validate.password(password, 'Password')
    validate.password(newPassword, 'New password')
    validate.password(againNewPassword, 'Repeat new password')

    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new CredentialsError('Wrong credentials. Try again')
        }

        if (newPassword !== againNewPassword) {
            throw new CredentialsError('Wrong credentials with new password')
        }

        const hash = await bcrypt.hash(newPassword, 5)

        user.password = hash
        await user.save()

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof CredentialsError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
import bcrypt from 'bcrypt'
import { User } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, CredentialsError } = errors

export default async function changeUserEmail(userId, newEmail, password, againPassword) {
    validate.id(userId, 'ID User')
    validate.email(newEmail, 'New email')
    validate.password(password, 'Password')
    validate.password(againPassword, 'Repeat password')

    try {
        const user = await User.findById(userId)
        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        const match = await bcrypt.compare(password, user.password)
        if (!match) {
            throw new CredentialsError('Wrong credentials. Try again')
        }

        if (password !== againPassword) {
            throw new CredentialsError('Passwords do not match. Try again')
        }

        user.email = newEmail
        await user.save()

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof CredentialsError) {
            throw error
        }

        throw new SystemError(error)
    }
}
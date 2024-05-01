import { File, User } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

export default async function downloadFileS3(userId, fileId) {
    validate.id(userId, 'ID User')
    validate.id(fileId, 'ID File')

    try {
        const user = await User.findById(userId).lean()
        if (!user) {
            throw new NotFoundError('User not found. Try again')
        }

        const file = await File.findById(fileId).lean()
        if (!file) {
            throw new NotFoundError('File not found. Try again')
        }

        return file.url
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
import fs from 'fs/promises'
import path from 'path'
import { User, File } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, AuthorizationError } = errors

export default async function deleteFile(userId, fileId) {
    validate.id(userId, 'ID User')
    validate.id(fileId, 'ID File')

    try {
        const user = await User.findById(userId).lean()
        if (!user) {
            throw new NotFoundError('User not found')
        }

        const file = await File.findById(fileId).lean()
        if (!file) {
            throw new NotFoundError('File not found')
        }

        if (file.owner.toString() === user._id.toString() || user.role[0] === 'admin') {
            const filePath = path.join('./uploads', file._id.toString())

            await fs.unlink(filePath)
            await File.findByIdAndDelete(fileId)

        } else {
            throw new AuthorizationError('Authorization denied. Try again')
        }

    } catch (error) {
        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
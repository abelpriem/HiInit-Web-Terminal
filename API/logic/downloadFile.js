import fs from 'fs/promises'
import { User, File } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, AuthorizationError } = errors

async function saveCopyFile(oldPath, newPath) {
    try {
        await fs.copyFile(oldPath, newPath)
    } catch (error) {
        throw new SystemError(`Failed to download file: ${error.message}`)
    }
}

export default async function downloadFile(userId, fileId) {
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

        if (file.owner[0] === user.id || user.role[0] === 'admin') {
            const originalName = file.name
            const oldPath = `./uploads/${file._id.toString()}`
            const newPath = `./downloads/${originalName}`

            await saveCopyFile(oldPath, newPath)

            // Devuelvo la info de la nueva ruta y el nombre original
            return { path: newPath, originalName }
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
import fs from 'fs/promises'
import { User, File } from '../data/models.js'
import { errors, validate } from 'com'

const { SystemError, NotFoundError, DuplicityError } = errors

async function saveFile(path, newPath) {
    try {
        return fs.rename(path, newPath)
    } catch (error) {
        throw new SystemError(`Failed to save file: ${error.message}`)
    }
}

async function uploadFile(userId, originalname, mimetype, oldPath) {
    validate.id(userId, 'ID user')
    validate.text(originalname, 'File name')
    validate.text(mimetype, 'File type')

    try {
        const user = await User.findById(userId).lean()
        if (!user) {
            throw new NotFoundError('User not found')
        }

        const file = await File.create({
            name: originalname,
            owner: userId,
            type: mimetype,
            permissions: 3
        })

        const newPath = `./uploads/${file._id.toString()}`
        await saveFile(oldPath, newPath)

        return { newPath, file }
    } catch (error) {
        if (error.code === 11000) {
            throw new DuplicityError('Cant upload: file already saved with that name... Try again')
        }

        if (error instanceof NotFoundError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}

export default uploadFile

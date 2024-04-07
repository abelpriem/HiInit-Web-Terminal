import { User, File } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError } = errors

export default async function retrieveFiles(userId) {
    validate.id(userId, 'ID User')

    try {
        const user = await User.findById(userId).lean()

        if (!user) {
            throw new NotFoundError('User not found')
        }

        // USER'S FILES AND SHARED WITH OWN GROUP
        if (user.role[0] === 'user') {
            if (user.group[0] === 'localhost') {
                const files = await File.find({ owner: userId }).lean()

                if (files.length === 0) {
                    throw new NotFoundError('You dont have any files in your storage!')
                }

                const filesArray = files.map(file => ({
                    id: file._id.toString(),
                    name: file.name,
                    owner: file.owner.toString()
                }))

                return filesArray
            } else {
                const userGroups = user.group
                const groupUsers = await User.find({ group: { $in: userGroups } }).lean()

                // Se buscan los archivos que comparten estos usuarios
                const sharedFiles = await File.find({ owner: { $in: groupUsers.map(user => user._id.toString()) } }).lean()

                if (sharedFiles.length === 0) {
                    throw new NotFoundError('There arent any files on storage!')
                }

                const filesArray = sharedFiles.map(file => ({
                    id: file._id.toString(),
                    name: file.name,
                    owner: file.owner.toString()
                }))

                return filesArray
            }
        }

        // ALL FILES WITH ADMIN
        if (user.role[0] === 'admin') {
            const files = await File.find().lean()

            if (files.length === 0) {
                throw new NotFoundError('There arent any files on storage!')
            }

            const filesArray = files.map(file => ({
                id: file._id.toString(),
                name: file.name
            }))

            return filesArray
        }
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
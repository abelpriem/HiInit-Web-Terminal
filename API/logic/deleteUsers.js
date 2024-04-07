import fs from 'fs/promises'
import { User, Group, File } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, AuthorizationError } = errors

async function deleteUser(userId, userIdDeleted) {
    validate.text(userId, 'ID User')
    validate.text(userIdDeleted, 'ID Deleted user')

    try {
        //BUSCAR ADMIN
        const adminUser = await User.findById(userId).lean()

        if (!adminUser)
            throw new NotFoundError('Admin not found')

        if (adminUser.role[0] !== 'admin')
            throw new AuthorizationError('Authorization denied. Only ADMIN user')

        // BUSCAR USUARIO A ELIMINAR
        const userToDelete = await User.findById(userIdDeleted).lean()

        if (!userToDelete)
            throw new NotFoundError('User not found')

        // BUSCAR Y ELIMINAR ARCHIVOS EN DISCO 
        const filesOnDisk = await File.find({ owner: userToDelete._id }).lean()

        filesOnDisk.forEach(file => {
            const filePath = `./uploads/${file._id.toString()}`

            try {
                fs.unlink(filePath)
            } catch (error) {
                throw new SystemError(`Error deleting file ${filePath}: ${error}`)
            }
        })

        // BORRAMOS ARCHIVOS DEL USER EN FILE
        await File.deleteMany({ owner: userToDelete._id })

        // BORRAMOS USER EN GROUP
        const userGroup = await Group.findOne({ name: userToDelete.group[0] })

        if (userGroup) {
            userGroup.members.pull(userToDelete._id)
            await userGroup.save()
        }

        // DELETE USER
        await User.findByIdAndDelete(userToDelete)
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}

export default deleteUser
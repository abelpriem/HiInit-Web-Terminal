import fs from 'fs'
import path from 'path'
import { User, File } from "../data/models.js"
import { validate, errors } from "com"
const { SystemError, NotFoundError } = errors

function uploadFileBB(userId, fileName, fileType) {
    validate.id(userId, 'ID user')
    validate.text(fileName, 'File name')
    validate.text(fileType, 'File type')

    return User.findById(userId).lean()
        .catch(error => { throw new SystemError(error.message) })
        .then(user => {
            if (!user) {
                throw new NotFoundError('User not found')
            }

            return File.create({ name: fileName, owner: user.id, type: fileType, parent: '', permissions: 3 })
                .catch(error => { throw new SystemError(error.message) })
                .then(file => {
                    const saveFile = path.join(__dirname, `uploads/${file._id}`)

                    return saveFile
                })

        })
}

export default uploadFileBB
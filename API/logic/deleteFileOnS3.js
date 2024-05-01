import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import { User, File } from '../data/models.js'
import { validate, errors } from 'com'
const { SystemError, NotFoundError, AuthorizationError } = errors

dotenv.config()
const s3 = new AWS.S3()

export default async function deleteFileOnS3(userId, fileId) {
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

        if (file.owner.toString() === user._id.toString() || user.role[0] === 'admin') {
            const params = {
                Bucket: `${process.env.AWS_BUCKET_NAME}`,
                Key: `${userId}/${file.name}`
            }

            await s3.deleteObject(params).promise()
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
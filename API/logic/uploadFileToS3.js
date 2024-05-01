import AWS from 'aws-sdk'
import dotenv from 'dotenv'
import { User, File } from "../data/models.js"
import { validate, errors } from "com"
const { SystemError, NotFoundError, DuplicityError } = errors

dotenv.config()

const region = `${process.env.AWS_REGION}`
const accessKeyId = `${process.env.AWS_ACCESS_KEY_ID}`
const secretAccessKey = `${process.env.AWS_SECRET_ACCESS_KEY}`

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey
})

export default async function uploadFileToS3(userId, fileData) {
    validate.id(userId, 'ID user')

    try {
        const user = await User.findById(userId).lean()
        if (!user) {
            throw new NotFoundError('User not found')
        }

        const params = {
            Bucket: `${process.env.AWS_BUCKET_NAME}`,
            Key: `${userId}/${fileData.originalname}`,
            Body: fileData.buffer
        }

        // SAVE SW3
        const data = await s3.upload(params).promise()

        // SAVE DISK
        await File.create({
            name: fileData.originalname,
            owner: userId,
            type: fileData.mimetype,
            permissions: 3,
            url: data.Location
        })

        return data.Location

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
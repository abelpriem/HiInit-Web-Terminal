import AWS from 'aws-sdk'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import { User, File } from "../data/models.js"
import { validate, errors } from "com"
const { SystemError, NotFoundError, DuplicityError } = errors

dotenv.config()

const region = `${process.env.AWS_REGION}`
const accessKeyId = `${process.env.AWS_ACCESS_KEY_ID}`
const secretAccessKey = `${process.env.AWS_SECRET_ACCESS_KEY}`
const bucketName = `${process.env.AWS_BUCKET_NAME}`

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey
})

async function saveFile(path, newPath) {
    try {
        return fs.rename(path, newPath)
    } catch (error) {
        throw new SystemError(`Failed to save file: ${error.message}`)
    }
}

export default async function uploadFileBB(userId, file) {
    validate.id(userId, 'ID user')

    const { originalName, mimeType, path } = file
    const oldPath = path

    try {
        const user = await User.findById(userId).lean()
        if (!user) {
            throw new NotFoundError('User not found')
        }

        const file = await File.create({
            name: originalName,
            owner: userId,
            type: mimeType,
            permissions: 3
        })

        const params = {
            Bucket: bucketName,
            Key: file._id.toString(),
            Body: await fs.readFile(path)
        }

        // SAVE ON SW3
        const data = await s3.upload(params).promise()
        console.log('Archivo subido exitosamente:', data.Location)

        // SAVE ON DISK
        const newPath = `./uploads/${file._id.toString()}`
        await saveFile(oldPath, newPath)

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
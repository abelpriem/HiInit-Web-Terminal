import fs from 'fs'
import jwt from 'jsonwebtoken'
const { JsonWebTokenError } = jwt
import uploadFile from '../logic/uploadFile.js'
import { errors } from 'com'

const { NotFoundError, ContentError, TokenError, DuplicityError } = errors

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    const { originalname, mimetype, path } = req.file
    const oldPath = path
    try {
        await uploadFile(userId, originalname, mimetype, oldPath)
        res.status(200).send()

    } catch (error) {
        let status = 500

        if (error instanceof NotFoundError)
            status = 404

        if (error instanceof ContentError || error instanceof TypeError || error instanceof DuplicityError) {
            status = 409
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}
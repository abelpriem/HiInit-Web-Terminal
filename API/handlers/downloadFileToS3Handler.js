import jwt from 'jsonwebtoken'
import downloadFileToS3 from '../logic/downloadFileS3.js'
import { errors } from 'com'

const { NotFoundError, TokenError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    const { fileId } = req.params

    try {
        const fileURL = await downloadFileToS3(userId, fileId)
        res.json(fileURL)

    } catch (error) {
        let status = 500

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof TypeError) {
            status = 409
        }

        res.status(status).json({ success: false, error: error.constructor.name, message: error.message })
    }
}
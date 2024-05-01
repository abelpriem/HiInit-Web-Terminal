import jwt from 'jsonwebtoken'
import deleteFileOnS3 from "../logic/deleteFileOnS3.js"
import { errors } from 'com'
const { NotFoundError, ContentError, AuthorizationError, TokenError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    const { fileId } = req.params

    try {
        await deleteFileOnS3(userId, fileId)
        res.status(200).json({ success: true, message: 'File succesfully eliminated!' })
    } catch (error) {
        let status = 500

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        if (error instanceof AuthorizationError) {
            status = 401
        }

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof TypeError || error instanceof ContentError) {
            status = 409
        }

        res.status(status).json({ success: false, error: error.constructor.name, message: error.message })
    }
}
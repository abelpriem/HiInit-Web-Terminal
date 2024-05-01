import jwt from 'jsonwebtoken'
import uploadFileToS3 from '../logic/uploadFileToS3.js'
import { errors } from 'com'

const { NotFoundError, ContentError, TokenError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    const file = req.file

    try {
        const fileUrl = await uploadFileToS3(userId, file)
        res.status(200).json({ success: true, URL: fileUrl })

    } catch (error) {
        let status = 500

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof TypeError || error instanceof ContentError) {
            status = 409
        }

        // console.log(error)
        res.status(status).json({ success: false, message: error.message })
    }
}

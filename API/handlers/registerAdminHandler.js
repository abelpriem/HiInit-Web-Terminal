import jwt from 'jsonwebtoken'
import registerAdmin from '../logic/registerAdmin.js'
import { errors } from 'com'

const { JsonWebTokenError } = jwt
const { TokenError, ContentError, NotFoundError, AuthorizationError } = errors

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    const { username, email, password } = req.body

    try {
        await registerAdmin(userId, username, email, password)
        res.status(201).send()

    } catch (error) {
        let status = 500

        if (error instanceof AuthorizationError) {
            error = 401
        }

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof ContentError || error instanceof TypeError) {
            status = 409
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}

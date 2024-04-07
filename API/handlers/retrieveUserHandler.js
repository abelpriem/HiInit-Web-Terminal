import jwt from 'jsonwebtoken'
const { JsonWebTokenError } = jwt
import retrieveUser from '../logic/retrieveUser.js'
import { errors } from 'com'
const { NotFoundError, ContentError, TokenError } = errors

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    try {
        const user = await retrieveUser(userId)
        res.json(user)

    } catch (error) {
        let status = 500

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof ContentError || error instanceof TypeError) {
            status = 409

        } else if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}
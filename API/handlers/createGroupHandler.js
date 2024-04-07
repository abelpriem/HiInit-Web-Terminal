import jwt from 'jsonwebtoken'
import createGroup from "../logic/createGroup.js"
import { errors } from 'com'
const { NotFoundError, ContentError, AuthorizationError, TokenError } = errors
const { JsonWebTokenError } = jwt

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    const { group } = req.body

    try {
        await createGroup(userId, group)
        res.status(201).send()

    } catch (error) {
        let status = 500

        if (error instanceof AuthorizationError) {
            status = 401
        }

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof TypeError || error instanceof ContentError) {
            status = 409
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}
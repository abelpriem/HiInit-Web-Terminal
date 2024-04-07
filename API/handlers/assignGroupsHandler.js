import jwt from 'jsonwebtoken'
import assignGroups from '../logic/assignGroups.js'
import { errors } from 'com'
const { JsonWebTokenError } = jwt
const { NotFoundError, AuthorizationError, ContentError, TokenError, DuplicityError } = errors

export default async (req, res) => {
    const token = req.headers.authorization.substring(7)
    const { sub: userId } = jwt.verify(token, process.env.JWT_SECRET)

    const { selectedGroupId, selectedUserId } = req.body

    try {
        await assignGroups(userId, selectedUserId, selectedGroupId)
        res.status(200).send()

    } catch (error) {
        let status = 500

        if (error instanceof AuthorizationError) {
            status = 401
        }

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof TypeError || error instanceof ContentError || error instanceof DuplicityError) {
            status = 409
        }

        if (error instanceof JsonWebTokenError) {
            status = 401
            error = new TokenError(error.message)
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}
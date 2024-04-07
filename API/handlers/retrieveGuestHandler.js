import retrieveGuest from "../logic/retrieveGuest.js"
import { errors } from 'com'
const { NotFoundError, ContentError } = errors

export default async (req, res) => {
    try {
        const guest = await retrieveGuest()
        res.json(guest)

    } catch (error) {
        let status = 500

        if (error instanceof NotFoundError) {
            status = 404
        }

        if (error instanceof ContentError || error instanceof TypeError) {
            status = 409
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}
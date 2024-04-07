import registerUser from '../logic/registerUser.js'
import { errors } from 'com'
const { DuplicityError, ContentError } = errors

export default async (req, res) => {
    const { username, email, password } = req.body

    try {
        await registerUser(username, email, password)
        res.status(201).send()

    } catch (error) {
        let status = 500

        if (error instanceof ContentError || error instanceof TypeError || error instanceof DuplicityError) {
            status = 409
        }

        res.status(status).json({ error: error.constructor.name, message: error.message })
    }
}

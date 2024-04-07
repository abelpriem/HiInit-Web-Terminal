import { User } from "../data/models.js"
import { errors } from "com"
const { SystemError, NotFoundError } = errors

export default async function retrieveGuest() {
    try {
        const guest = await User.findOne({ email: 'guest@hiinit.com' }).lean()

        if (!guest) {
            throw new NotFoundError('Guest not found. Try again')
        }

        // USERNAME - TYPE - ROLE
        delete guest._id
        delete guest.__v
        delete guest.email
        delete guest.password

        return guest
    } catch (error) {
        if (error instanceof NotFoundError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
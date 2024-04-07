import { User, Group } from '../data/models.js'
import { errors, validate } from 'com'
const { SystemError, NotFoundError, AuthorizationError, DuplicityError } = errors


export default async function assignGroups(userId, userIdToHandle, groupIdToAssign) {
    validate.id(userId, 'ID Admin')
    validate.id(userIdToHandle, 'ID User')
    validate.id(groupIdToAssign, 'ID Group')

    try {
        const admin = await User.findById(userId).lean()

        if (!admin) {
            throw new NotFoundError('Admin not found. Try again')
        }

        if (admin.role[0] === 'admin') {
            const group = await Group.findById(groupIdToAssign)
            if (!group) {
                throw new NotFoundError('Group not found. Try again')
            }

            const user = await User.findById(userIdToHandle)
            if (!user) {
                throw new NotFoundError('User not found. Try again')
            }

            // REMOVE CURRENT USER GROUP
            if (user.group) {
                const currentGroup = await Group.findOne({ name: user.group[0] })

                if (currentGroup && currentGroup.members.includes(user._id)) {
                    if (!group.members.includes(user._id)) {
                        const index = currentGroup.members.indexOf(user._id)
                        currentGroup.members.splice(index, 1)

                        await currentGroup.save()

                        // ADD USER TO CHOSEN GROUP
                        group.members.push(user._id)
                        await group.save()

                        // Actualizar el grupo del usuario
                        user.group[0] = group.name
                        await user.save()
                    } else {
                        throw new DuplicityError('User already belongs to this group...')
                    }
                }
            }
        } else {
            throw new AuthorizationError('Authorization denied. Only ADMIN user')
        }
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof AuthorizationError || error instanceof DuplicityError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}
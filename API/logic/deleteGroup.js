import { Group, User } from '../data/models.js'
import { errors, validate } from 'com'
const { SystemError, NotFoundError, AuthorizationError } = errors

export default async function deleteGroup(userId, groupId) {
    validate.id(userId, 'ID User')
    validate.id(groupId, 'ID Group')

    try {
        const admin = await User.findById(userId).lean()

        if (!admin) {
            throw new NotFoundError('Admin not found. Try again')
        }

        if (admin.role[0] === 'admin') {
            // GRUPO A ELIMINAR
            const groupToDelete = await Group.findById(groupId).lean() 

            if (!groupToDelete) {
                throw new NotFoundError('Group not found. Try again')
            }

            // USUARIOS DEL GRUPO A ELIMINAR
            const usersToModify = await User.find({ group: { $in: groupToDelete.name } }) 
        
            if (usersToModify) {
                // GRUPO LOCALHOST
                const groupLocalhost = await Group.findOne({ name: 'localhost' })
                
                if (!groupLocalhost) {
                    throw new NotFoundError('Group localhost not found. Try again')
                }

                // IDS INDIVIDUALES
                const usersId = usersToModify.map(user => user._id)

                usersToModify.forEach(user => {
                    user.group[0] = groupLocalhost.name
                })

                // ACTUALIZO EL GRUPO 'LOCALHOST' CON LOS ID's
                groupLocalhost.members.push(...usersId) 

                await Promise.all([
                    groupLocalhost.save(),
                    ...usersToModify.map(user => User.findByIdAndUpdate(user._id, { group: user.group })),
                    
                    // ELIMINAMOS GRUPO
                    Group.findByIdAndDelete(groupId) 
                ])
            } else {
                await Group.findByIdAndDelete(groupId) 
            }
        } else {
            throw new AuthorizationError('Authorization denied. Only ADMIN user')
        }
    } catch (error) {
        if (error instanceof NotFoundError || error instanceof AuthorizationError) {
            throw error
        }

        throw new SystemError(error.message)
    }
}


// const usersId = await User.find({ group: { $in: groupToDelete.name } }).distinct('_id') // ID DE LOS USUARIOS

//users.push(usersToModify._id)
//                groupLocalhost.members.push(users)
    
//                groupLocalhost.save()
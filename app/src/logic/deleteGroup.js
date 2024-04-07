import session from './session.js'
import { errors, validate } from 'com'
const { SystemError } = errors

// LOGIC - DELETE FILE
function deleteGroup(groupId) {
    validate.id(groupId, 'ID Group')

    const req = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${session.token}`
        }
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/admin/groups/delete/${String(groupId)}`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }
        })
}

export default deleteGroup
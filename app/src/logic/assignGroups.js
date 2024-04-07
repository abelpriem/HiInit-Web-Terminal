import session from './session.js'
import { errors, validate } from 'com'
const { SystemError } = errors

export default function assignGroups(selectedGroupId, selectedUserId) {
    validate.id(selectedGroupId, 'ID Group selected')
    validate.id(selectedUserId, 'ID User selected')

    const req = {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${session.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ selectedGroupId, selectedUserId })
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/admin/groups/edit`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }
        })
}
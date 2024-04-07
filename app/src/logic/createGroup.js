import session from './session'
import { errors, validate } from 'com'
const { SystemError } = errors

export default function createGroup(group) {
    validate.text(group, 'FRONT group')

    const req = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ group })
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/admin/groups`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }
        })
}
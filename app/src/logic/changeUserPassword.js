import session from './session.js'
import { errors, validate } from 'com'
const { SystemError } = errors

// LOGIC - CHANGE USER PASSWORD
function changeUserPassword(password, newPassword, againNewPassword) {
    validate.password(password, 'Password')
    validate.password(newPassword, 'New password')
    validate.password(againNewPassword, 'Repeat new password')

    const req = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ password, newPassword, againNewPassword })
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/users/password`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }
        })
}

export default changeUserPassword
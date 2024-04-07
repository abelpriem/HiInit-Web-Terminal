import session from './session.js'
import { errors, validate } from 'com'
const { SystemError } = errors

// LOGIC - CHANGE USER EMAIL
function changeUserEmail(newEmail, password, againPassword) {
    validate.email(newEmail, 'New email')
    validate.password(password, 'Password')
    validate.password(againPassword, 'Repeat password')

    const req = {
        method: 'PATCH',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.token}`
        },
        body: JSON.stringify({ newEmail, password, againPassword })
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/users/email`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }
        })
}

export default changeUserEmail
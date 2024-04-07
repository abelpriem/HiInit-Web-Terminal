import session from './session.js'
import { errors, validate } from 'com'
const { SystemError } = errors

// LOGIC - REGISTER ADMIN
function registerAdmin(username, email, password) {
    validate.text(username, 'New ADMIN username')
    validate.email(email, 'New ADMIN email')
    validate.password(password, 'New ADMIN password')

    const req = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session.token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/admin`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }
        })

}

export default registerAdmin
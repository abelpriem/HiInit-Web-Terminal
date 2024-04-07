import { errors, validate } from 'com'
const { SystemError } = errors

// LOGIC - REGISTER USER
function registerUser(username, email, password) {
    validate.text(username, 'Username')
    validate.email(email, 'Email')
    validate.password(password, 'Password')

    const req = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, email, password })
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/users`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }
        })
}

export default registerUser

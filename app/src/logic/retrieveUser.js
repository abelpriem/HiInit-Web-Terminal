import session from './session.js'
import { errors } from 'com'
const { SystemError } = errors

// LOGIC - RETRIEVE USER
function retrieveUser() {
    const req = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session.token}`
        }
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/users`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }

            return res.json()
                .catch(error => { throw new SystemError(error.message) })
                .then(user => {

                    session.role = user.role
                    return user
                })
        })
}

export default retrieveUser
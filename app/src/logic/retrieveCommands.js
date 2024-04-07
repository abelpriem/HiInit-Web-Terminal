import session from './session'
import { errors } from 'com'
const { SystemError } = errors

// LOGIC - RETRIEVE COMMANDS 
function retrieveFiles() {
    const req = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session.token}`
        }
    }

    return fetch('http://localhost:9001/commands', req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }

            return res.json()
                .catch(error => { throw new SystemError(error.message) })
                .then(commands => { return commands })
        })
}

export default retrieveFiles

import { errors } from 'com'
const { SystemError } = errors

// LOGIC - RETRIEVE GUEST 
function retrieveGuest() {
    const req = {
        method: 'GET'
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/guest`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }

            return res.json()
                .catch(error => { throw new SystemError(error.message) })
                .then(guest => { return guest })
        })
}

export default retrieveGuest
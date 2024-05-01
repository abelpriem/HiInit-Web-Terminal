import session from './session'
import { validate, errors } from 'com'
const { SystemError } = errors

// LOGIC - DOWNLOAD FILE
function downloadFile(fileId) {
    validate.id(fileId)

    const req = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${session.token}`
        }
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/download/${String(fileId)}`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }

            return res.json()
                .catch(error => { throw new SystemError(error.message) })
                .then(url => { return url })
        })
}

export default downloadFile
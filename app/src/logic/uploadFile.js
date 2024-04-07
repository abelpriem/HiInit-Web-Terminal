import session from './session.js'
import { errors } from 'com'
const { SystemError } = errors

// LOGIC - UPLOAD FILE
function uploadFile(file) {
    const formData = new FormData()
    formData.append('file', file)

    const req = {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session.token}`
        },
        body: formData
    }

    return fetch(`${import.meta.env.VITE_HIINIT_APP}/upload`, req)
        .catch(error => { throw new SystemError(error.message) })
        .then(res => {
            if (!res.ok) {
                return res.json()
                    .catch(error => { throw new SystemError(error.message) })
                    .then(body => { throw new errors[body.error](body.message) })
            }
        })
}

export default uploadFile
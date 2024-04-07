import session from './session.js'

function logoutUser(callback) {
    session.token = null
    session.sessionUserId = null
    session.role = null

    callback(null)
}

export default logoutUser
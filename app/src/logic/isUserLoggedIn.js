import session from './session'

export default function isUserLoggedIn() {
    return !!session.token
}
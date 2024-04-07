import { ContentError } from './errors.js'

const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const ID_REGEX = /^[0-9A-Fa-f]{24}$/

function text(string, explain) {
    if (typeof string !== 'string') throw new TypeError(`${explain} is not a string`)
    if (!string.trim().length) throw new ContentError(`${explain} is empty`)
}

function email(email, explain) {
    text(email, explain)
    if (!EMAIL_REGEX.test(email)) throw new ContentError(`${explain} is not valid`)
}

function password(password, explain) {
    text(password, explain)
    if (password.length < 8) throw new RangeError(`${explain} length is lower than 8 characters`)
}

function id(id, explain) {
    text(id, explain)
    if (!ID_REGEX.test(id)) throw new ContentError(`${explain} is not a valid ID`)
}

const validate = {
    text,
    email,
    password,
    id
}

export default validate
import { Types } from 'mongoose'
const { ObjectId } = Types

function username() {
    return `name-${Math.random()}`
}

function email() {
    return `email-${Math.random()}@gmail.com`
}

function password() {
    return `password-${Math.random()}`
}

function text() {
    return `text-${Math.random()}`
}

function id() {
    return new ObjectId().toString()
}

const random = {
    username,
    email,
    password,
    text,
    id
}

export default random
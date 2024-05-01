import mongoose from 'mongoose'
const { Schema, model } = mongoose

// USER
const user = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    group: [
        {
            type: String,
            ref: 'Group',
            default: ["localhost"]
        }
    ],
    role: [
        {
            type: String,
            enum: ['guest', 'user', 'admin'],
            default: 'user'
        }
    ]
})

// GROUP
const group = new Schema({
    name: {
        type: String,
        unique: true,
        default: 'localhost'
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

// COMMAND
const command = new Schema({
    name: {
        type: String,
        unique: true
    }
})

// FILE
const file = new Schema({
    name: {
        type: String,
        unique: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: 'File'
    },
    permissions: {
        type: Number,
        enum: [0, 2, 3]
    },
    url: {
        type: String
    }
})

const User = new model('User', user)
const Group = new model('Group', group)
const Command = new model('Command', command)
const File = new model('File', file)

export {
    User,
    Group,
    Command,
    File
}
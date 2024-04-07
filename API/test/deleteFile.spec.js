import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import deleteFile from '../logic/deleteFile.js'
import random from './helpers/random.js'
import { expect } from 'chai'
import { User, File } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError, AuthorizationError } = errors

dotenv.config()

describe('deleteFile', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => File.deleteMany())

    // POSITIVE CASE
    it('success with deleting file', async () => {

    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const user = random.id()
        const file = await File.create({ name: random.text(), owner: user, type: random.text(), permissions: 3 })

        try {
            await deleteFile(user, file.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found')
        }
    })

    // NEGATIVE CASE - File not found
    it('fails on file not found', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const file = random.id()

        try {
            await deleteFile(user.id, file)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('File not found')
        }
    })

    // NEGATIVE CASE - Deleting file without authorization
    it('fails on deleting a file without authorization', async () => {
        const ownerUser = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const otherUser = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const file = await File.create({ name: random.text(), owner: ownerUser.id, type: random.text(), permissions: 3 })

        try {
            await deleteFile(otherUser.id, file.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthorizationError)
            expect(error.message).to.be.equal('Authorization denied. Try again')
        }
    })

    after(() => mongoose.disconnect())
})
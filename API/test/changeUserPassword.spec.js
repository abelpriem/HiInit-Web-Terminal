import mongoose, { Types } from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { expect } from 'chai'
import random from './helpers/random.js'
import changeUserPassword from '../logic/changeUserPassword.js'
import { errors } from 'com'
import { User } from '../data/models.js'
const { ObjectId } = Types
const { NotFoundError, CredentialsError } = errors

dotenv.config()

describe('changeUserPassword', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSSITIVE CASE
    it('success with changing user password', async () => {
        const password = random.password()
        const newPassword = random.password()
        const againNewPassword = newPassword

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username: random.username(), email: random.email(), password: hash, group: 'localhost', role: 'user' })
        const value = await changeUserPassword(user.id, password, newPassword, againNewPassword)

        expect(value).to.be.undefined

        const match = await bcrypt.compare(password, user.password)

        expect(match).to.be.true
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const userId = new ObjectId().toString()
        const password = random.password()
        const newPassword = random.password()
        const againNewPassword = newPassword

        try {
            await changeUserPassword(userId, password, newPassword, againNewPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Wrong credentials with account password
    it('fails on entry wrong account password', async () => {
        const password = random.password()
        const newPassword = random.password()
        const againNewPassword = newPassword

        const wrongPassword = random.password()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username: random.username(), email: random.email(), password: hash, group: 'localhost', role: 'user' })

        try {
            await changeUserPassword(user.id, wrongPassword, newPassword, againNewPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.be.equal('Wrong credentials. Try again')
        }
    })

    // NEGATIVE CASE - Wrong credentials with repeating new password
    it('fails on credentials with repeating new password', async () => {
        const password = random.password()
        const newPassword = random.password()
        const againNewPassword = random.password()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username: random.username(), email: random.email(), password: hash, group: 'localhost', role: 'user' })

        try {
            await changeUserPassword(user.id, password, newPassword, againNewPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.be.equal('Wrong credentials with new password')
        }
    })

    after(() => mongoose.disconnect())

})
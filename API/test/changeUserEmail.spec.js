import mongoose, { Types } from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { expect } from 'chai'
import random from './helpers/random.js'
import changeUserEmail from '../logic/changeUserEmail.js'
import { errors } from 'com'
import { User } from '../data/models.js'
const { ObjectId } = Types
const { NotFoundError, CredentialsError } = errors

dotenv.config()

describe('changeUserEmail', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSTIVE CASE
    it('success with changing email user', async () => {
        const password = random.password()
        const againNewPassword = password
        const newEmail = random.email()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username: random.username(), email: random.email(), password: hash, group: 'localhost', role: 'user' })
        await changeUserEmail(user.id, newEmail, password, againNewPassword)

        const checkUserEmail = await User.findById(user.id)

        expect(checkUserEmail).to.be.an('Object')
        expect(checkUserEmail.email).to.be.equal(newEmail)
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const userId = new ObjectId().toString()
        const newEmail = random.email()
        const password = random.password()
        const againNewPassword = password

        try {
            await changeUserEmail(userId, newEmail, password, againNewPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Wrong credentials with account password
    it('fails on entry wrong account password', async () => {
        const password = random.password()
        const againNewPassword = password

        const wrongPassword = random.password()
        const newEmail = random.email()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username: random.username(), email: random.email(), password: hash, group: 'localhost', role: 'user' })

        try {
            await changeUserEmail(user.id, newEmail, wrongPassword, againNewPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.be.equal('Wrong credentials. Try again')
        }
    })

    // NEGATIVE CASE - Wrong credentials with repeating account password
    it('fails on credentials with repeating password', async () => {
        const password = random.password()
        const againNewPassword = random.password()

        const newEmail = random.email()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username: random.username(), email: random.email(), password: hash, group: 'localhost', role: 'user' })

        try {
            await changeUserEmail(user.id, newEmail, password, againNewPassword)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(CredentialsError)
            expect(error.message).to.be.equal('Passwords do not match. Try again')
        }
    })

    after(() => mongoose.disconnect())
})
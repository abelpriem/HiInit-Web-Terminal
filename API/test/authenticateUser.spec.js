import mongoose from 'mongoose'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import random from './helpers/random.js'
import authenticateUser from '../logic/authenticateUser.js'
import { expect } from 'chai'
import { User } from '../data/models.js'

dotenv.config()

describe('authenticateUser', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('success on authenticate user', async () => {
        const password = random.password()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username: random.username(), email: random.email(), password: hash, group: 'localhost', role: 'user' })
        const userId = await authenticateUser(user.email, password)

        expect(userId.toString()).to.be.a('String')
        expect(userId.toString()).to.equal(user._id.toString())
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const email = random.email()
        const password = random.password()

        try {
            await authenticateUser(email, password)
            { throw new Error('should not reach this point!') }
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Wrong credentials
    it('fails on wrong credentials with password', async () => {
        const password = random.password()

        const hash = await bcrypt.hash(password, 5)
        const user = await User.create({ username: random.username(), email: random.email(), password: hash, group: 'localhost', role: 'user' })

        try {
            await authenticateUser(user.email, '234234234')
            { throw new Error('should not reach this point!') }
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.be.equal('Wrong credentials. Check again')
        }
    })

    after(() => mongoose.disconnect())
})
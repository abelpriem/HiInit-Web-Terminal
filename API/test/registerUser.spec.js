import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

import { User, Group } from '../data/models.js'
import { expect } from 'chai'
import registerUser from '../logic/registerUser.js'
import random from './helpers/random.js'

dotenv.config()

describe('registerUser', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())

    // POSITIVE CASE
    it('success on register a new user type', async () => {
        const username = random.username()
        const email = random.email()
        const password = random.password()

        await Group.create({ name: 'localhost', members: [] })
        await registerUser(username, email, password)

        const user = await User.findOne({ email })

        expect(user).to.exist
        expect(user.username).to.equal(user.username)
        expect(user.email).to.equal(user.email)
        expect(user.group[0]).to.be.equal('localhost')
        expect(user.role[0]).to.be.equal('user')

        const match = await bcrypt.compare(password, user.password)

        expect(match).to.be.true
    })

    // NEGATIVE CASE - Duplicity user
    it('fails on user already exist', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        try {
            await registerUser(user.username, user.email, user.password)
            { throw new Error('should not reach this point!') }
        } catch (error) {
            expect(error).to.be.instanceOf(Error)
            expect(error.message).to.equal('Account already exist. Try again')
        }
    })

    after(() => mongoose.disconnect())
})


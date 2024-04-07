import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { expect } from 'chai'

import retrieveGuest from '../logic/retrieveGuest.js'
import random from './helpers/random.js'
import { errors } from 'com'
import { User } from '../data/models.js'
const { NotFoundError } = errors

dotenv.config()

describe('retrieveGuest', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany({}))

    // POSSITIVE CASE
    it('success with retrieve user type -guest-', async () => {
        const user = await User.create({ username: random.username(), email: 'guest@hiinit.com', password: random.password(), group: 'hiinit', role: 'guest' })
        const guest = await retrieveGuest()

        expect(guest).to.be.an('Object')
        expect(guest.group).to.be.an('Array').that.includes.members(user.group)
        expect(guest.role).to.be.an('Array').that.includes.members(user.role)
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        try {
            await retrieveGuest()
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Guest not found. Try again')
        }
    })

    after(() => mongoose.disconnect())
})


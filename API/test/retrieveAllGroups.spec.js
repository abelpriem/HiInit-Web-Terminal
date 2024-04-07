import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveAllGroups from '../logic/retrieveAllGroups.js'
import random from './helpers/random.js'
import { expect } from 'chai'
import { User, Group } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError, AuthorizationError } = errors

dotenv.config()

describe('retrieveAllGroups', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Group.deleteMany())

    // POSITIVE CASE
    it('success with retrieve ALL groups', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })

        const group1 = await Group.create({ name: random.text() })
        const group2 = await Group.create({ name: random.text() })
        const group3 = await Group.create({ name: random.text() })

        const allGroups = await retrieveAllGroups(admin.id)

        const groups = await allGroups.map(group => group.name)

        expect(allGroups).to.be.an('Array').that.has.lengthOf(3)
        expect(groups).to.include.members([group1.name, group2.name, group3.name])
    })

    // NEGATIVE CASE - Admin not found
    it('fails on admin not found', async () => {
        const userRequest = random.id()

        try {
            await retrieveAllGroups(userRequest)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Admin not found. Try again')
        }
    })

    // NEGATIVE CASE - Authorization denied
    it('fails on trying retrieve groups without ADMIN role', async () => {
        const userRequest = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        try {
            await retrieveAllGroups(userRequest.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthorizationError)
            expect(error.message).to.be.equal('Authorization denied. Only ADMIN user')
        }
    })

    after(() => mongoose.disconnect())
})
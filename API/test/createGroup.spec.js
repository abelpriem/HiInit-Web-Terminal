import mongoose from 'mongoose'
import dotenv from 'dotenv'
import createGroup from '../logic/createGroup.js'
import random from './helpers/random.js'
import { User, Group } from '../data/models.js'
import { expect } from 'chai'
import { errors } from 'com'
const { NotFoundError, DuplicityError, AuthorizationError } = errors

dotenv.config()

describe('createGroup', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Group.deleteMany())

    // POSITIVE CASE 
    it('success on create a group with ADMIN user', async () => {
        const name = random.text()

        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })
        const group = await createGroup(admin.id, name)

        expect(group).to.be.undefined
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const userId = random.id()
        const name = random.text()

        try {
            await createGroup(userId, name)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found')
        }
    })

    // NEGATIVE CASE - Not ADMIN user
    it('fails on create group without ADMIN user', async () => {
        const name = random.text()
        const user = await User.create({ username: random.text(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        try {
            await createGroup(user.id, name)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthorizationError)
            expect(error.message).to.be.equal('Authorization denied. Only ADMIN user')
        }
    })

    // NEGATIVE CASE - Duplicity command
    it('fails on create group that already exist', async () => {
        const name = random.text()
        const name2 = name

        const admin = await User.create({ username: random.text(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })

        try {
            await createGroup(admin.id, name)
            await createGroup(admin.id, name2)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.be.equal('Group already exist. Try again')
        }
    })

    after(() => mongoose.disconnect())
})
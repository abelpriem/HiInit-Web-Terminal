import mongoose from 'mongoose'
import dotenv from 'dotenv'
import deleteGroup from '../logic/deleteGroup.js'
import random from './helpers/random.js'
import { User, Group } from '../data/models.js'
import { errors } from 'com'
import { expect } from 'chai'
const { NotFoundError, AuthorizationError } = errors

dotenv.config()

describe('deleteGroup', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Group.deleteMany())

    // POSITIVE CASE
    it('success on delete group', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })

        const user1 = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'testgroup', role: 'user' })
        const user2 = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'testgroup', role: 'user' })

        const testGroup = await Group.create({ name: 'testgroup', members: [user1.id, user2.id] })
        const localhost = await Group.create({ name: 'localhost', members: [] })

        await deleteGroup(admin.id, testGroup.id)

        const checkTestGroup = await Group.findById(testGroup.id)
        const checkLocalHost = await Group.findById(localhost.id)

        debugger

        expect(checkTestGroup).to.be.null
        expect(checkLocalHost.members).to.has.lengthOf(2).that.includes(user1.id, user2.id)
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const user = random.id()
        const group = random.id()

        try {
            await deleteGroup(user, group)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Admin not found. Try again')
        }
    })

    // NEGATIVE CASE - Group not found
    it('fails on group not found', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })
        const group = random.id()

        try {
            await deleteGroup(admin.id, group)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Group not found. Try again')
        }
    })

    // NEGATIVE CASE - Group 'localhost' not found
    it('fails on group localhost (default) not found', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })
        const group = await Group.create({ name: 'testgroup', members: [] })

        try {
            await deleteGroup(admin.id, group.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Group localhost not found. Try again')
        }
    })

    // NEGATIVE CASE - Trying to delete without ADMIN mode
    it('fails on deleting group without ADMIN mode', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const group = await Group.create({ name: 'testgroup', members: [] })

        try {
            await deleteGroup(user.id, group.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthorizationError)
            expect(error.message).to.be.equal('Authorization denied. Only ADMIN user')
        }
    })

    after(() => mongoose.disconnect())
})
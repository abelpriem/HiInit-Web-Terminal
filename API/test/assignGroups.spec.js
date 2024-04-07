import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import assignGroups from '../logic/assignGroups.js'
import { User, Group } from '../data/models.js'
import { expect } from 'chai'
import { errors } from 'com'
const { NotFoundError, AuthorizationError, DuplicityError } = errors

dotenv.config()

describe('assignGroups', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Group.deleteMany())

    // POSITIVE CASE
    it('success with assign group on ADMIN mode', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })

        const userToChange = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        await Group.create({ name: 'localhost', members: [userToChange.id] })

        const groupToAdd = await Group.create({ name: random.text(), members: [] })

        await assignGroups(admin.id, userToChange.id, groupToAdd.id)

        const userChanged = await User.findById(userToChange.id)

        expect(userChanged).to.be.an('Object')
        expect(userChanged.group[0]).to.be.equal(groupToAdd.name)
    })

    // NEGATIVE CASE - Admin not found
    it('fails on admin not found', async () => {
        const admin = random.id()
        const user = random.id()
        const group = random.id()

        try {
            await assignGroups(admin, user, group)
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
        const user = random.id()

        try {
            await assignGroups(admin.id, user, group)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Group not found. Try again')
        }
    })

    // NEGATIVE CASE - Assign user not found
    it('fails on user not found', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })
        const group = await Group.create({ name: random.text(), members: [] })
        const user = random.id()

        try {
            await assignGroups(admin.id, user, group.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - Not ADMIN user
    it('fails on assign group without ADMIN user', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const group = random.id()
        const userToAssign = random.id()

        try {
            await assignGroups(user.id, userToAssign, group)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthorizationError)
            expect(error.message).to.be.equal('Authorization denied. Only ADMIN user')
        }
    })

    // NEGATIVE CASE - Trying to assign on same group
    it('fails on assign group that already belongs user', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        const localhost = await Group.create({ name: 'localhost', members: [user.id] })
        const groupToAssign = localhost

        try {
            await assignGroups(admin.id, user.id, groupToAssign.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.be.equal('User already belongs to this group...')
        }
    })

    after(() => mongoose.disconnect())
})
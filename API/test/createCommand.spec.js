import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import createCommand from '../logic/createCommand.js'
import { expect } from 'chai'
import { User, Command } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError, DuplicityError, AuthorizationError } = errors

dotenv.config()

describe('createCommand', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Command.deleteMany())

    // POSITIVE CASE
    it('success with creating command on ADMIN mode', async () => {
        const name = random.text()

        const admin = await User.create({ username: random.text(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })
        const command = await createCommand(admin.id, name)

        expect(command).to.be.an('Object')
        expect(command.name).to.be.equal(name)
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const userId = random.id()
        const name = random.text()

        try {
            await createCommand(userId, name)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found')
        }
    })

    // NEGATIVE CASE - Not ADMIN user
    it('fails on create command without admin user', async () => {
        const name = random.text()
        const user = await User.create({ username: random.text(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        try {
            await createCommand(user.id, name)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthorizationError)
            expect(error.message).to.be.equal('Authorization denied. Only ADMIN user')
        }
    })

    // NEGATIVE CASE - Duplicity command
    it('fails on create command that already exist', async () => {
        const name = random.text()
        const name2 = name

        const admin = await User.create({ username: random.text(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })

        try {
            await createCommand(admin.id, name)
            await createCommand(admin.id, name2)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.be.equal('Command already exist. Try again')
        }
    })

    after(() => mongoose.disconnect())
})
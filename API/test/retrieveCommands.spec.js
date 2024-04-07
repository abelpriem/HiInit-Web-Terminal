import mongoose from 'mongoose'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import retrieveCommands from '../logic/retrieveCommands.js'
import { expect } from 'chai'
import { User, Command } from '../data/models.js'

dotenv.config()

describe('retrieveCommands', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => Command.deleteMany())

    // FIRST CASE - GUEST
    it('success on retrieve commands with guest type', async () => {
        const guestId = random.id()

        await Command.create([{ name: 'help' }, { name: 'exit' }, { name: 'login' }, { name: 'download' }])
        const commands = await retrieveCommands(guestId)

        expect(commands).to.include('help')
        expect(commands).to.include('exit')
        expect(commands).to.include('login')
        expect(commands).not.include('download')
    })

    // SECOND CASE - USER
    it('success on retrieve commands with regular user', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        await Command.create([{ name: 'help' }, { name: 'exit' }, { name: 'login' }, { name: 'download' }, { name: 'ls' }])

        const commands = await retrieveCommands(user.id)

        expect(commands).to.have.lengthOf(5)
    })

    after(() => mongoose.disconnect())
})
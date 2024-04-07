import mongoose from 'mongoose'
import dotenv from 'dotenv'
import retrieveFiles from '../logic/retrieveFiles.js'
import random from './helpers/random.js'
import { User, File } from '../data/models.js'
import { expect } from 'chai'
import { errors } from 'com'
const { NotFoundError } = errors

dotenv.config()

describe('retrieveFiles', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => File.deleteMany())

    // POSITIVE CASE
    it('success with files retrieved - users files', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        const file1 = await File.create({ name: random.text(), owner: user.id, type: random.text(), permissions: 3 })
        const file2 = await File.create({ name: random.text(), owner: user.id, type: random.text(), permissions: 3 })
        const file3 = await File.create({ name: random.text(), owner: user.id, type: random.text(), permissions: 3 })

        const filesUser = await retrieveFiles(user.id)

        expect(filesUser).to.be.an('Array').that.has.lengthOf(3)
        expect(filesUser[0].name).to.be.equal(file1.name)
        expect(filesUser[1].name).to.be.equal(file2.name)
        expect(filesUser[2].name).to.be.equal(file3.name)
    })

    // POSITIVE CASE
    it('success with files retrieved - shared group files', async () => {
        const user1 = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'sharedgroup', role: 'user' })
        const user2 = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'sharedgroup', role: 'user' })

        const file1 = await File.create({ name: random.text(), owner: user1.id, type: random.text(), permissions: 3 })
        const file2 = await File.create({ name: random.text(), owner: user1.id, type: random.text(), permissions: 3 })
        const file3 = await File.create({ name: random.text(), owner: user1.id, type: random.text(), permissions: 3 })
        const file4 = await File.create({ name: random.text(), owner: user2.id, type: random.text(), permissions: 3 })
        const file5 = await File.create({ name: random.text(), owner: user2.id, type: random.text(), permissions: 3 })

        const filesShared = await retrieveFiles(user1.id)

        expect(filesShared).to.be.an('Array').that.has.lengthOf(5)
        expect(filesShared[0].name).to.be.equal(file1.name)
        expect(filesShared[1].name).to.be.equal(file2.name)
        expect(filesShared[2].name).to.be.equal(file3.name)
        expect(filesShared[3].name).to.be.equal(file4.name)
        expect(filesShared[4].name).to.be.equal(file5.name)

    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const userId = random.id()

        try {
            await retrieveFiles(userId)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found')
        }
    })

    // NEGATIVE CASE - No user files
    it('fails on user has no files in storage', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        try {
            await retrieveFiles(user.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('You dont have any files in your storage!')
        }
    })

    // NEGATIVE CASE - No files to shared
    it('fails on no files to share in storage', async () => {
        const user1 = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'sharedgroup', role: 'user' })
        await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'sharedgroup', role: 'user' })

        try {
            await retrieveFiles(user1.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('There arent any files on storage!')
        }
    })

    // NEGATIVE CASE - No files in storage on ADMIN mode
    it('fails on no files in storage on ADMIN mode', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })

        try {
            await retrieveFiles(admin.id)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('There arent any files on storage!')
        }
    })

    after(() => mongoose.disconnect())
})


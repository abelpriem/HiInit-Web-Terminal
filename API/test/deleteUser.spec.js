import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import deleteUsers from '../logic/deleteUsers.js'
import random from './helpers/random.js'
import { expect } from 'chai'
import { User, Group, File } from '../data/models.js'
import { errors } from 'com'
const { NotFoundError, AuthorizationError } = errors

dotenv.config()

describe('deleteUser', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => File.deleteMany())
    beforeEach(() => Group.deleteMany())

    // POSSITIVE CASE
    it('success with delete user on ADMIN mode', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })
        const userToDelete = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        await Group.create({ name: 'root', members: [admin.id] })
        const localhost = await Group.create({ name: 'localhost', member: [userToDelete.id] })

        const file = await File.create({ name: random.text(), owner: userToDelete.id, type: random.text(), permissions: 3 })
        const filePath = `./uploads/${file._id.toString()}`
        await fs.writeFile(filePath, 'Archivo de borrado')

        const result = await deleteUsers(admin.id, userToDelete.id)

        const checkUser = await User.findById(userToDelete.id)
        const checkGroup = await Group.findById(localhost.id)
        const checkFile = await File.findById(file.id)

        let fileExists = true

        try {
            await fs.access(filePath)
        } catch (error) {
            fileExists = false
        }

        expect(checkUser).to.be.null
        expect(checkFile).to.be.null
        expect(checkGroup.members).to.not.include(userToDelete.id)
        expect(fileExists).to.be.false
        expect(result).to.be.undefined
    })

    // NEGATIVE CASE - Admin not found
    it('fails on admin user not found', async () => {
        const admin = random.id()
        const deleteUser = random.id()

        try {
            await deleteUsers(admin, deleteUser)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('Admin not found')
        }
    })

    // NEGATIVE CASE - Not ADMIN role
    it('fails on trying to delete with no ADMIN mode', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const deleteUser = random.id()

        try {
            await deleteUsers(user.id, deleteUser)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(AuthorizationError)
            expect(error.message).to.be.equal('Authorization denied. Only ADMIN user')
        }

    })

    // NEGATIVE CASE - User to delete not found
    it('fails on delete user not found', async () => {
        const admin = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'root', role: 'admin' })
        const deleteUser = random.id()

        try {
            await deleteUsers(admin.id, deleteUser)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found')
        }
    })

    after(() => mongoose.disconnect())
})
import mongoose from 'mongoose'
import fs from 'fs/promises'
import dotenv from 'dotenv'
import random from './helpers/random.js'
import downloadFile from '../logic/downloadFile.js'
import { expect } from 'chai'
import { User, File } from '../data/models.js'
import { errors } from 'com'
const { SystemError, NotFoundError, AuthorizationError } = errors

dotenv.config()

describe('downloadFile', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => File.deleteMany())

    // POSITIVE CASE
    it('success with dowloading a file', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const file = await File.create({ name: 'descarga_SPEC.pdf', owner: user.id, type: 'application/pdf', permissions: 3 })

        const path = `./uploads/${file._id.toString()}`
        await fs.writeFile(path, 'Descarga de archivo de prueba')

        const succesDownloadFile = await downloadFile(user.id, file.id)
        const { path: newPath } = succesDownloadFile

        let fileExist = true

        try {
            await fs.access(newPath)
        } catch (error) {
            fileExist = false
        }

        expect(fileExist).to.be.true
        expect(newPath).to.be.equal(`./downloads/${file.name}`)
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const user = random.id()
        const file = random.id()

        try {
            await downloadFile(user, file)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found. Try again')
        }
    })

    // NEGATIVE CASE - File not found
    it('fails on file not found', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const file = random.id()

        try {
            await downloadFile(user.id, file)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('File not found. Try again')
        }
    })

    // NEGATIVE CASE - Other user trying to download his file
    // it('fails on other user trying to download a file', async () => {
    //     const user1 = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
    //     const user2 = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

    //     const file = await File.create({ name: 'archivo_PRUEBA.pdf', owner: user1.id, type: 'application/pdf', permissions: 3 })

    //     try {
    //         await downloadFile(user2.id, file.id)
    //         throw new Error('should not reach this point!')
    //     } catch (error) {
    //         expect(error).to.be.instanceOf(AuthorizationError)
    //         expect(error.message).to.be.equal('Authorization denied. Try again')
    //     }
    // })

    after(() => mongoose.disconnect())
})
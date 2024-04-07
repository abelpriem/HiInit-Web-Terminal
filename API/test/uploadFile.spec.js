import fs from 'fs/promises'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { expect } from 'chai'
import uploadFile from '../logic/uploadFile.js'
import random from './helpers/random.js'
import { errors } from 'com'
import { User, File } from '../data/models.js'
const { NotFoundError, DuplicityError } = errors

dotenv.config()

describe('uploadFiles', () => {
    before(() => mongoose.connect(process.env.URL_MONGODB_TEST))

    beforeEach(() => User.deleteMany())
    beforeEach(() => File.deleteMany())

    // POSITIVE CASE
    it('success with uploading user file', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })

        const oldPath = `../test-drive`
        await fs.writeFile(oldPath, 'Subida de archivo de prueba')

        const succesUploadFile = await uploadFile(user.id, random.text(), random.text(), oldPath)
        const { newPath } = succesUploadFile

        let fileExist = true

        try {
            await fs.access(newPath)
        } catch (error) {
            fileExist = false
        }

        expect(fileExist).to.be.true
    })

    // NEGATIVE CASE - User not found
    it('fails on user not found', async () => {
        const userId = random.id()
        const fileName = random.text()
        const fileType = random.text()
        const oldPath = random.text()

        try {
            await uploadFile(userId, fileName, fileType, oldPath)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(NotFoundError)
            expect(error.message).to.be.equal('User not found')
        }
    })

    // NEGATIVE CASE - Duplicity on file name
    it('fails on trying to upload a file that already exist', async () => {
        const user = await User.create({ username: random.username(), email: random.email(), password: random.password(), group: 'localhost', role: 'user' })
        const file = await File.create({ name: random.text(), owner: user.id, type: random.text(), permissions: 3 })

        const oldPath = `../test-drive`
        await fs.writeFile(oldPath, 'Subida de archivo de prueba')

        try {
            await uploadFile(user.id, file.name, file.type, oldPath)
            throw new Error('should not reach this point!')
        } catch (error) {
            expect(error).to.be.instanceOf(DuplicityError)
            expect(error.message).to.be.equal('Cant upload: file already saved with that name... Try again')
        }
    })

    after(() => mongoose.disconnect())
})
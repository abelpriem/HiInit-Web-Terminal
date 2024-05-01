import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import multer from 'multer'
import AWS from 'aws-sdk'
import {
    authenticateUserHandler,
    registerUserHandler,
    retrieveUserHandler,
    retrieveGuestHandler,
    changeUserEmailHandler,
    changeUserPasswordHandler,
    uploadFileHandler,
    uploadFileToS3Handler,
    downloadFileHandler,
    downloadFileToS3Handler,
    deleteFileHandler,
    retrieveFilesHandler,

    deleteUsersHandler,
    deleteFileOnS3Handler,
    retrieveAllUsersHandler,
    registerAdminHandler,
    createGroupHandler,
    retrieveAllGroupsHandler,
    assignGroupsHandler,
    deleteGroupHandler
} from './handlers/index.js'

dotenv.config()

mongoose.connect(process.env.URL_MONGODB_HIINIT_API)
    .then(() => {
        const server = express()
        const jsonBodyParser = express.json()

        // DISK STORAGE
        // const upload = multer({ dest: 'uploads/' })

        // S3 STORAGE
        const upload = multer()

        server.use(cors())

        // AWS CREDENTIALS
        AWS.config.update({
            accessKeyId: `${process.env.AWS_ACCESS_KEY_ID}`,
            secretAccessKey: `${process.env.AWS_SECRET_ACCESS_KEY}`
        })

        // ALL API REQUEST
        server.get('/hello', (req, res) => res.send('Hello HIINIT API v0.0'))

        // REGISTER USER
        server.post('/users', jsonBodyParser, registerUserHandler)

        // AUTHENTICATE USER
        server.post('/users/auth', jsonBodyParser, authenticateUserHandler)

        // RETRIEVE USER
        server.get('/users', retrieveUserHandler)

        // RETRIEVE GUEST
        server.get('/guest', retrieveGuestHandler)

        // CHANGE USER EMAIL
        server.patch('/users/email', jsonBodyParser, changeUserEmailHandler)

        // CHANGE USER PASSWORD
        server.patch('/users/password', jsonBodyParser, changeUserPasswordHandler)

        // UPLOAD FILE ON DISK
        // server.post('/upload', upload.single('file'), uploadFileHandler)

        // UPLOAD FILE ON AWS
        server.post('/upload', upload.single('file'), uploadFileToS3Handler)

        // RETRIEVE FILES
        server.get('/download', retrieveFilesHandler)

        // DOWNLOAD FILE ON DISK
        // server.get('/download/:fileId', downloadFileHandler)

        // DOWNLOAD FILE ON AWS
        server.get('/download/:fileId', downloadFileToS3Handler)

        // DELETE FILE ON DISK
        // server.delete('/download/delete/:fileId', deleteFileHandler)

        // DELETE FILE ON DISK
        server.delete('/download/delete/:fileId', deleteFileOnS3Handler)

        // REGISTER ADMIN
        server.post('/admin', jsonBodyParser, registerAdminHandler)

        // RETRIEVE ALL USERS
        server.get('/admin/users/all', retrieveAllUsersHandler)

        // DELETE USERS
        server.delete('/admin/users/delete/:deleteUser', deleteUsersHandler)

        // CREATE GROUPS
        server.post('/admin/groups', jsonBodyParser, createGroupHandler)

        // RETRIEVE ALL GROUPS
        server.get('/admin/groups/all', retrieveAllGroupsHandler)

        // ASSIGN GROUPS
        server.patch('/admin/groups/edit', jsonBodyParser, assignGroupsHandler)

        // DELETE GROUPS
        server.delete('/admin/groups/delete/:groupId', deleteGroupHandler)

        server.listen(process.env.PORT, () => console.log(`server online! Listen on: ${process.env.PORT}`))
    })
    .catch(error => console.error(error))

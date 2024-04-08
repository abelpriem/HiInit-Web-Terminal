import authenticateUserHandler from './authenticateUserHandler.js'
import registerUserHandler from './registerUserHandler.js'
import retrieveUserHandler from './retrieveUserHandler.js'
import retrieveGuestHandler from './retrieveGuestHandler.js'
import changeUserEmailHandler from './changeUserEmailHandler.js'
import changeUserPasswordHandler from './changeUserPasswordHandler.js'

import retrieveFilesHandler from './retrieveFilesHandler.js'
import uploadFileHandler from './uploadFileHandler.js'
import uploadFileToS3Handler from './uploadFileToS3Handler.js'
import downloadFileHandler from './downloadFileHandler.js'
import deleteFileHandler from './deleteFileHandler.js'

import retrieveAllUsersHandler from './retrieveAllUsersHandler.js'
import deleteUsersHandler from './deleteUsersHandler.js'
import registerAdminHandler from './registerAdminHandler.js'
import createGroupHandler from './createGroupHandler.js'
import retrieveAllGroupsHandler from './retrieveAllGroupsHandler.js'
import assignGroupsHandler from './assignGroupsHandler.js'
import deleteGroupHandler from './deleteGroupHandler.js'

export {
    authenticateUserHandler,
    registerUserHandler,
    retrieveUserHandler,
    retrieveGuestHandler,
    changeUserEmailHandler,
    changeUserPasswordHandler,

    retrieveFilesHandler,
    uploadFileHandler,
    uploadFileToS3Handler,
    downloadFileHandler,
    deleteFileHandler,

    retrieveAllUsersHandler,
    deleteUsersHandler,
    registerAdminHandler,
    createGroupHandler,
    retrieveAllGroupsHandler,
    assignGroupsHandler,
    deleteGroupHandler
}
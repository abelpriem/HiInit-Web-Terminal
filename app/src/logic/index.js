import loginUser from './loginUser.js'
import registerUser from './registerUser.js'
import retrieveUser from './retrieveUser.js'
import retrieveGuest from './retrieveGuest.js'
import logoutUser from './logoutUser.js'
import isUserLoggedIn from './isUserLoggedIn.js'
import changeUserEmail from './changeUserEmail.js'
import changeUserPassword from './changeUserPassword.js'

import retrieveFiles from './retrieveFiles.js'
import uploadFile from './uploadFile.js'
import deleteFile from './deleteFile.js'
import downloadFile from './downloadFile.js'

import deleteUser from './deleteUser.js'
import retrieveAllUsers from './retrieveAllUsers.js'
import retrieveAllGroups from './retrieveAllGroups.js'
import registerAdmin from './registerAdmin.js'
import createGroup from './createGroup.js'
import assignGroups from './assignGroups.js'
import deleteGroup from './deleteGroup.js'

export {
    loginUser,
    registerUser,
    retrieveUser,
    retrieveGuest,
    logoutUser,
    isUserLoggedIn,
    changeUserEmail,
    changeUserPassword,

    retrieveFiles,
    uploadFile,
    deleteFile,
    downloadFile,

    retrieveAllUsers,
    deleteUser,
    registerAdmin,
    createGroup,
    retrieveAllGroups,
    assignGroups,
    deleteGroup
}

const logic = {
    loginUser,
    registerUser,
    retrieveUser,
    retrieveGuest,
    logoutUser,
    isUserLoggedIn,
    changeUserEmail,
    changeUserPassword,

    retrieveFiles,
    uploadFile,
    deleteFile,
    downloadFile,

    retrieveAllUsers,
    deleteUser,
    registerAdmin,
    createGroup,
    retrieveAllGroups,
    assignGroups,
    deleteGroup
}

export default logic
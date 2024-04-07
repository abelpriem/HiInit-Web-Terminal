import Swal from 'sweetalert2'
import './console2.js'
import logic from '../logic/index.js'

import { errors } from 'com'
const { ContentError, DuplicityError, NotFoundError, TokenError, CredentialsError } = errors

// HANDLE ERROR
function handleError(error, navigate) {
    let errorLevel = 'Fatal'
    let errorMessage = error.message

    if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError) {
        errorLevel = 'Warn'
    }

    if (error instanceof DuplicityError || error instanceof NotFoundError || error instanceof CredentialsError) {
        errorLevel = 'Error'
    }

    if (error instanceof TokenError) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Session expired! "
        })

        errorLevel = 'Token'
        logic.logoutUser(() => navigate("/"))
    }

    console2.log(errorLevel + ': ' + errorMessage)

    return
}

export default handleError
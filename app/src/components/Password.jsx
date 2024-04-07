import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logic from '../logic'
import Context from '../Context'

function Password() {
    // FIELDS STATE
    const [showPassword, setShowPassword] = useState(true)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showRepeatNewPass, setShowRepeatNewPass] = useState(false)

    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    function showInputNewPassword() {
        setShowNewPassword(true)
    }

    function showInputRepeatNewPassword() {
        setShowRepeatNewPass(true)
    }

    function handleSubmit(event) {
        event.preventDefault()

        const clientError = document.querySelector('#client-error-new-password')

        const password = event.target.querySelector('#password').value
        const newPassword = event.target.querySelector('#new-password').value
        const againNewPassword = event.target.querySelector('#repeat-new-password').value

        try {
            logic.changeUserPassword(password, newPassword, againNewPassword)
                .then(() => {
                    clientError.innerText = 'Password successfully changed ✅'
                    clientError.style.color = 'green'
                })
                .catch(error => {
                    clientError.innerText = error.message
                    clientError.style.color = 'tomato'

                    handleError(error, navigate)
                })
        } catch (error) {
            clientError.innerText = error.message
            clientError.style.color = 'tomato'

            handleError(error, navigate)
        }

        document.body.addEventListener('keydown', function () {
            clientError.innerText = 'Change Password - Entry your data account: '
            clientError.style.color = '#EBDBB2'

            // document.getElementById("new-password-form").reset()
        })
    }

    return <>
        <div>
            <p>~$</p>

            <span>
                <form id="new-password-form" onSubmit={handleSubmit}>
                    <p id="client-error-new-password">Change Password - Entry your data account: </p>

                    {showPassword && (
                        <div className="fields">
                            <label htmlFor="password"><p style={{ color: '#18E3C8' }}>Password: </p></label>
                            <input type="password" id="password" contentEditable="true" autoComplete="off" onChange={showInputNewPassword} />
                        </div>
                    )}

                    {showNewPassword && (
                        <div className="fields">
                            <label htmlFor="new-password"><p style={{ color: '#18E3C8' }}>New password: </p></label>
                            <input type="password" id="new-password" contentEditable="true" autoComplete="off" onChange={showInputRepeatNewPassword} />
                        </div>
                    )}

                    {showRepeatNewPass && (
                        <div className="fields">
                            <label htmlFor="repeat-new-password"><p style={{ color: '#18E3C8' }}>Repeat password: </p></label>
                            <input type="password" id="repeat-new-password" contentEditable="true" autoComplete="off" />
                        </div>
                    )}

                    <button className="button-form">Send</button>
                </form>
            </span>
        </div >
    </>
}

export default Password
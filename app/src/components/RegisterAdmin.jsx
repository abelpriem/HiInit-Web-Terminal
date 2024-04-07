import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logic from '../logic'
import Context from '../Context'

function RegisterAdmin() {

    // FIELDS STATE
    const [showUsername, setShowUsername] = useState(true)
    const [showEmail, setShowEmail] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    // SHOW EMAIL INPUT
    function showInputEmail() {
        setShowEmail(true)
    }

    // SHOW PASSWORD INPUT
    function showInputPassword() {
        setShowPassword(true)
    }

    // REGISTER FUNCTION
    function handleSubmit(event) {
        event.preventDefault()

        const clientError = document.querySelector('#client-error-register-admin')

        const username = event.target.querySelector('#username').value
        const email = event.target.querySelector('#email').value
        const password = event.target.querySelector('#password').value

        try {
            return logic.registerAdmin(username, email, password)
                .then(() => {
                    clientError.innerText = 'Admin succesfully created! ✅'
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
            clientError.innerText = 'ADMIN - Create a new ADMINISTRATOR account: '
            clientError.style.color = '#EBDBB2'
        })
    }

    return <>
        <div>
            <p>~$</p>
            <span>
                <form className="register-admin-form" onSubmit={handleSubmit}>
                    <p id="client-error-register-admin">ADMIN - Create a new ADMINISTRATOR account: </p>

                    <div className="space-between">
                        {showUsername && (
                            <div className="fields">
                                <label htmlFor="username"> <p style={{ color: '#18E3C8' }}>Username: </p></label>
                                <input type="text" id="username" contentEditable="true" autoComplete="off" onChange={showInputEmail} />
                            </div>
                        )}

                        {showEmail && (
                            <div className="fields">
                                <label htmlFor="email"><p style={{ color: '#18E3C8' }}>Email: </p></label>
                                <input type="text" id="email" contentEditable="true" autoComplete="off" onChange={showInputPassword} />
                            </div>
                        )}

                        {showPassword && (
                            <div className="fields">
                                <label htmlFor="password"><p style={{ color: '#18E3C8' }}>Password: </p></label>
                                <input type="password" id="password" contentEditable="true" autoComplete="off" name="password" />
                            </div>
                        )}
                    </div>

                    <button className="button-form" type="submit" >Send</button>
                </form>
            </span>

        </div >
    </>
}

export default RegisterAdmin
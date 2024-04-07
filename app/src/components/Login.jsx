import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import logic from '../logic'
import Context from '../Context'

function Login({ onSuccess }) {

    // FIELDS STATE
    const [showEmail, setShowEmail] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    function showInputPassword() {
        setShowPassword(true)
    }

    function handleSubmitLogin(event) {
        event.preventDefault()

        const clientError = document.querySelector('#client-error-login')

        const email = event.target.querySelector('#email').value
        const password = event.target.querySelector('#password').value

        try {
            logic.loginUser(email, password)
                .then(() => onSuccess())
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
            clientError.innerText = 'Login - Entry your credentials: '
            clientError.style.color = '#EBDBB2'
        })
    }

    return <>
        <div>
            <p>~$</p>
            <span>
                <form className="login-form" onSubmit={handleSubmitLogin}>
                    <p id="client-error-login">Login - Entry your credentials: </p>

                    {showEmail && (
                        <div className="fields">
                            <label htmlFor="email"><p style={{ color: '#18E3C8' }}>Email: </p></label>
                            <input type="email" id="email" contentEditable="true" autoComplete="off" onChange={showInputPassword} />
                        </div>
                    )}

                    {showPassword && (
                        <div className="fields">
                            <label htmlFor="password"><p style={{ color: '#18E3C8' }}>Password: </p></label>
                            <input type="password" id="password" contentEditable="true" autoComplete="off" />
                        </div>
                    )}

                    <button className="button-form" type="submit" >Send</button>
                </form>
            </span>
        </div >
    </>
}

export default Login
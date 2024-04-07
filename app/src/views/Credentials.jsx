import { useState, useEffect, useContext } from 'react'
import { useNavigate, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { Desktop, Initial } from '../views'
import { Login, Register } from '../components'
import { CommandBar, Pointer } from '../utils'

import logic from '../logic'
import Context from '../Context'

function Credentials() {

    // POINTER, UKNOWN COMMAND & POINTER STATE
    const [commandText, setCommandText] = useState('')
    const [uknownCommand, setUknownCommand] = useState(false)
    const [help, setHelp] = useState(false)
    const { pointer } = Pointer()

    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    // ESCUCHA TECLADO, ERROR Y ESCRITURA
    useEffect(() => {
        const handleKeyPress = (event) => {
            let commandText = document.getElementById('command').value

            if ((commandText === 'register' || commandText === 'REGISTER') && event.key === 'Enter') {
                setUknownCommand(false)
                navigate('/credentials/register')
            } else if ((commandText === 'login' || commandText === 'LOGIN') && event.key === 'Enter') {
                setUknownCommand(false)
                navigate('/credentials/login')
            } else if ((commandText === 'EXIT' || commandText === 'exit') && event.key === 'Enter') {
                handleLogout()
            } else if ((commandText === 'HELP' || commandText === 'help') && event.key === 'Enter') {
                setHelp(!help)
            } else if (event.key === 'Enter' && commandText.trim() !== '') {
                setUknownCommand(!uknownCommand)
            }
        }

        const handleKeyDown = () => {
            setUknownCommand(false)
            setHelp(false)
        }

        document.addEventListener('keypress', handleKeyPress)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keypress', handleKeyPress)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [navigate, uknownCommand, help])

    // LOGIN VIEW
    function handleLoginShow() {
        navigate('/credentials/login')
    }

    // DESKTOP VIEW
    function handleDesktopShow() {
        navigate('/desktop')
    }

    // EXIT SESSION
    function ProtectedRoute({ element }) {
        return logic.isUserLoggedIn() ? element : <Navigate to="/*" />;
    }

    // LOGOUT VIEW
    function handleLogout() {
        logic.logoutUser(error => {
            if (error) {
                handleError(error, navigate)
            }

            navigate('/')
        })
    }

    return <>
        <div className="container">
            <p>~$</p>
            <p>Please, entry login or register command to switch different components. Entry 'HELP' to see all commands</p>

            <div className="command-bar">
                <CommandBar />
                <div id="command-form">
                    <input id="command" type="text" contentEditable="true" autoFocus autoComplete="off" value={commandText} onChange={(event) => setCommandText(event.target.value)}
                        style={{ width: `${Math.max(10, commandText.length * 8)}px` }} />
                </div>
                <p>{pointer}</p>
            </div>

            <Routes>
                <Route path="/register" element={logic.isUserLoggedIn() ? <Navigate to="/login" /> : <Register onSuccess={handleLoginShow} />}></Route>
                <Route path="/login" element={logic.isUserLoggedIn() ? <Navigate to="/desktop" /> : <Login onSuccess={handleDesktopShow} />}></Route>
                <Route path="/desktop" element={<ProtectedRoute element={<Desktop onLogout={handleLogout} />} />} />
            </Routes>

            <br />

            {uknownCommand && (
                <span>
                    <p>shell: command not found: '{commandText}'. Entry login or register, help or exit</p>
                </span>
            )}

            {help && (
                <ul>
                    <p>GUEST ~$ Command types</p>
                    <p>- - - - - - - - - - - - - - - - - - - </p>
                    <li><p>help: <em>list user commands</em></p></li>
                    <li><p>exit: <em>get back to initial page</em></p></li>
                    <li><p>login: <em>entry your credentials</em></p></li>
                    <li><p>register: <em>create an account</em></p></li>
                    <p>- - - - - - - - - - - - - - - - - - - </p>
                </ul>
            )}
        </div>
    </>
}

export default Credentials
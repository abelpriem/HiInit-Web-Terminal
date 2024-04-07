import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Context from '../Context'
import { Pointer, CommandBar } from '../utils'

import logic from '../logic'
import session from '../logic/session.js'

function Desktop() {
    const [commandText, setCommandText] = useState('')
    const [uknownCommand, setUknownCommand] = useState(false)
    const [help, setHelp] = useState(false)
    const { pointer } = Pointer()

    const [fetchingUser, setFetchingUser] = useState(true) // Controlador bucle retrieveUser

    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    // ESCUCHA TECLADO, ERROR Y ESCRITURA
    useEffect(() => {
        const handleKeyPress = (event) => {
            let commandText = document.getElementById('command').value

            if ((commandText === 'EXIT' || commandText === 'exit') && event.key === 'Enter') {
                handleLogout()
            } else if ((commandText === 'UPLOAD' || commandText === 'upload') && event.key === 'Enter') {
                setUknownCommand(false)
                navigate('/upload')
            } else if ((commandText === 'DOWNLOAD' || commandText === 'download') && event.key === 'Enter') {
                setUknownCommand(false)
                navigate('/download')
            } else if ((commandText === 'PROFILE' || commandText === 'profile') && event.key === 'Enter') {
                setUknownCommand(false)
                navigate('/profile')
            } else if (session.role === 'admin' && (commandText === 'SUDO' || commandText === 'sudo') && event.key === 'Enter') {
                setUknownCommand(false)
                setFetchingUser(!fetchingUser)
                navigate('/administrator')
            } else if ((commandText === 'HELP' || commandText === 'help') && event.key === 'Enter') {
                setHelp(!help)
            } else if (event.key === 'Enter') {
                setUknownCommand(!uknownCommand)
            }
        }

        const handleKeyDown = () => {
            setUknownCommand(false)
            setHelp(false)
            setFetchingUser(false)
        }

        document.addEventListener('keypress', handleKeyPress)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keypress', handleKeyPress)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [navigate, uknownCommand, help, fetchingUser])

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
            <p>Hi! Wellcome to your C:\Desktop</p>

            <br />

            <div className="command-bar">
                <CommandBar />

                <div id="command-form">
                    <input id="command" type="text" contentEditable="true" autoFocus autoComplete="off" value={commandText} onChange={(event) => setCommandText(event.target.value)}
                        style={{ width: `${Math.max(10, commandText.length * 8)}px` }} />
                </div>
                <p>{pointer}</p>
            </div>

            {uknownCommand && (
                <span>
                    <p>shell: command not found: '{commandText}'. Press 'help' to list commands</p>
                </span>
            )}

            {session.role === 'user' && help && (
                <ul>
                    <p>USER ~$ Command types </p>
                    <p>- - - - - - - - - - - - - - - - - - - </p>
                    <li><p>help: <em>list user commands</em></p></li>
                    <li><p>pwd: <em>show your current directory</em></p></li>
                    <li><p>desktop: <em>get back to your main field</em></p></li>
                    <li><p>profile: <em>settings account</em></p></li>
                    <li><p>upload: <em>save files on storage</em></p></li>
                    <li><p>download: <em>recover files from drive</em></p></li>
                    <li><p>exit: <em>get back to initial page</em></p></li>
                    <p>- - - - - - - - - - - - - - - - - - - </p>
                </ul>
            ) || session.role === 'admin' && help && (
                <ul>
                    <p>ADMIN ~$ Command types </p>
                    <p>- - - - - - - - - - - - - - - - - - - </p>
                    <li><p>sudo: <em>entry on ADMIN mode</em></p></li>
                    <li><p>help: <em>list user commands</em></p></li>
                    <li><p>pwd: <em>show your current directory</em></p></li>
                    <li><p>desktop: <em>get back to your main field</em></p></li>
                    <li><p>profile: <em>settings account</em></p></li>
                    <li><p>upload: <em>save files on storage</em></p></li>
                    <li><p>download: <em>recover files from drive</em></p></li>
                    <li><p>exit: <em>get back to initial page</em></p></li>
                    <p>- - - - - - - - - - - - - - - - - - - </p>
                </ul>
            )}
        </div>
    </>
}

export default Desktop

import { useState, useEffect, useContext } from 'react'
import { useNavigate, Routes, Route } from 'react-router-dom'

import { Pointer, CommandBar } from '../utils'
import { RegisterAdmin, CreateGroup, AssignGroup } from '../components'

import Context from '../Context'
import logic from '../logic'
import session from '../logic/session.js'

export default function Sudo() {
    const [pwd, setPwd] = useState(false)
    const [commandText, setCommandText] = useState('')
    const [menu, setMenu] = useState(true)
    const [uknownCommand, setUknownCommand] = useState(false)
    const { pointer } = Pointer()

    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    // ESCUCHA TECLADO, ERROR Y ESCRITURA
    useEffect(() => {
        const handleKeyPress = (event) => {
            let commandText = document.getElementById('command').value

            if ((commandText === 'EXIT' || commandText === 'exit') && event.key === 'Enter') {
                handleLogout()
            } else if ((commandText === 'DESKTOP' || commandText === 'desktop') && event.key === 'Enter') {
                setUknownCommand(false)
                setMenu(false)
                navigate('/desktop')
            } else if (session.role === 'admin' && (commandText === 'sudo --1') && event.key === 'Enter') {
                setUknownCommand(false)
                setMenu(false)
                navigate('/administrator/create-admin')
            } else if (session.role === 'admin' && (commandText === 'sudo --2') && event.key === 'Enter') {
                setUknownCommand(false)
                setMenu(false)
                navigate('/delete-user')
            } else if (session.role === 'admin' && (commandText === 'sudo --3') && event.key === 'Enter') {
                setUknownCommand(false)
                setMenu(false)
                navigate('/administrator/create-group')
            } else if (session.role === 'admin' && (commandText === 'sudo --4') && event.key === 'Enter') {
                setUknownCommand(false)
                setMenu(false)
                navigate('/administrator/assign-group')
            } else if (session.role === 'admin' && (commandText === 'sudo --5') && event.key === 'Enter') {
                setUknownCommand(false)
                setMenu(false)
                navigate('/delete-group')
            } else if (session.role === 'admin' && (commandText === 'SUDO' || commandText === 'sudo') && event.key === 'Enter') {
                setUknownCommand(false)
                setMenu(true)
                navigate('/administrator')
            } else if ((commandText === 'PWD' || commandText === 'pwd') && event.key === 'Enter') {
                setPwd(true)
            } else if (event.key === 'Enter') {
                setUknownCommand(!uknownCommand)
            }
        }

        const handleKeyDown = () => {
            setUknownCommand(false)
            setPwd(false)
        }

        document.addEventListener('keypress', handleKeyPress)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keypress', handleKeyPress)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [navigate, uknownCommand, menu])

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
            <p>ADMINISTRATOR. Please, choose an option: </p>

            <br />

            <div className="command-bar">
                <CommandBar />

                <div id="command-form">
                    <input id="command" type="text" contentEditable="true" autoFocus autoComplete="off" value={commandText} onChange={(event) => setCommandText(event.target.value)}
                        style={{ width: `${Math.max(10, commandText.length * 8)}px` }} />
                </div>
                <p>{pointer}</p>
            </div>

            <Routes>
                <Route path="/create-admin" element={<RegisterAdmin />} />
                <Route path="/create-group" element={<CreateGroup />} />
                <Route path="/assign-group" element={<AssignGroup />} />
            </Routes>

            <br />

            {menu && (
                <ol>
                    <li><p><strong>Create New ADMIN</strong></p></li>
                    <li><p><strong>Delete Users</strong></p></li>
                    <li><p><strong>Create New Group</strong></p></li>
                    <li><p><strong>Assign Groups to Users</strong></p></li>
                    <li><p><strong>Delete Groups</strong></p></li>
                </ol>
            )}

            <br />

            {uknownCommand && (
                <span>
                    <p>shell: command not found: '{commandText}'. Entry sudo, desktop or exit</p>
                </span>
            )}

            {pwd && (
                <span>
                    <p>You are on ~ C:\Desktop\Administrator</p>
                </span>
            )}
        </div>
    </>
}
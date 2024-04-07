import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'
import logic from '../logic'
import { CommandBar, Pointer } from '../utils'
import Users from './Users'

function DeleteUsers() {
    const [users, setUsers] = useState([])
    const [commandText, setCommandText] = useState('')
    const [uknownCommand, setUknownCommand] = useState(false)
    const [list, setList] = useState(false)
    const [clientError, setClientError] = useState({
        message: 'Entry ls command to list all registered users:',
        color: '#EBDBB2'
    })
    const [fetchingUsers, setFetchingUsers] = useState(false) // Controlador bucle retrieveUsers

    const { pointer } = Pointer()
    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    useEffect(() => {
        const handleKeyPress = (event) => {
            let commandText = document.getElementById('command').value

            if ((commandText === 'DESKTOP' || commandText === 'desktop') && event.key === 'Enter') {
                setUknownCommand(false)
                setList(false)
                navigate('/desktop')
            } else if ((commandText === 'LS' || commandText === 'ls') && event.key === 'Enter') {
                setList(true)
            } else if ((commandText === 'EXIT' || commandText === 'exit') && event.key === 'Enter') {
                setList(false)
                handleLogout()
            } else if ((commandText === 'SUDO' || commandText === 'sudo') && event.key === 'Enter') {
                setList(false)
                navigate('/administrator')
            } else if (event.key === 'Enter') {
                setUknownCommand(!uknownCommand)
            }
        }

        const handleKeyDown = () => {
            setUknownCommand(false)
            setClientError({
                message: 'Entry ls command to list all registered users:',
                color: '#EBDBB2'
            })
        }

        document.addEventListener('keypress', handleKeyPress)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keypress', handleKeyPress)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [navigate, uknownCommand, setList])

    useEffect(() => {
        if (fetchingUsers || list) {
            const fetchDeleted = async () => {
                try {
                    const result = await logic.retrieveAllUsers()
                    setUsers(result)
                    setFetchingUsers(false)

                } catch (error) {
                    setClientError({
                        message: "There is no users registered on APP yet...",
                        color: 'tomato'
                    })

                    setFetchingUsers(false)
                    handleError(error, navigate)
                }
            }

            fetchDeleted()
        }
    }, [fetchingUsers, list, handleError, navigate])

    // LOGOUT VIEW
    function handleLogout() {
        logic.logoutUser(error => {
            if (error) {
                handleError(error, navigate)
            }

            navigate('/')
        })
    }

    return (
        <div className="container">
            <p>~$</p>
            <p id="client-error-delete-user">{clientError.message}</p>

            <br />

            <div className="command-bar">
                <CommandBar />
                <div id="command-form">
                    <input id="command" type="text" contentEditable="true" autoFocus autoComplete="off" value={commandText} onChange={(event) => setCommandText(event.target.value)}
                        style={{ width: `${Math.max(10, commandText.length * 8)}px` }} />
                </div>
                <p>{pointer}</p>
            </div>

            <br />

            {uknownCommand && (
                <>
                    <span>
                        <p>shell: command not found: '{commandText}'. Entry desktop, ls or exit</p>
                    </span>
                </>
            )}

            {list && users.map(user => <Users key={user.id} user={user} updateUserList={setUsers} clientError={'#client-error-delete-user'} />)}
        </div>
    )
}

export default DeleteUsers

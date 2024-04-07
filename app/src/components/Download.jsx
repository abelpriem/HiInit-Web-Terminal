import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'
import logic from '../logic'
import { CommandBar, Pointer } from '../utils'
import Files from './Files'

function Download() {
    const [pwd, setPwd] = useState(false)
    const [files, setFiles] = useState([])
    const [commandText, setCommandText] = useState('')
    const [uknownCommand, setUknownCommand] = useState(false)
    const [list, setList] = useState(false)
    const [clientError, setClientError] = useState({
        message: 'Entry ls command to list all your save files:',
        color: '#EBDBB2'
    })
    const [fetchingFiles, setFetchingFiles] = useState(false) // Controlador bucle retrieveFiles

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
            } else if ((commandText === 'PWD' || commandText === 'pwd') && event.key === 'Enter') {
                setPwd(true)
            } else if (event.key === 'Enter') {
                setUknownCommand(!uknownCommand)
            }
        }

        const handleKeyDown = () => {
            setUknownCommand(false)
            setClientError({
                message: 'Entry ls command to list all your save files:',
                color: '#EBDBB2'
            })
            setPwd(false)
        }

        document.addEventListener('keypress', handleKeyPress)
        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keypress', handleKeyPress)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [navigate, uknownCommand, setList])

    useEffect(() => {
        if (fetchingFiles || list) {
            const fetchData = async () => {
                try {
                    const result = await logic.retrieveFiles()
                    setFiles(result)
                    setFetchingFiles(false)

                } catch (error) {
                    setClientError({
                        message: "You don't have any files in your storage...",
                        color: 'tomato'
                    })

                    handleError(error, navigate)
                    setFetchingFiles(false)
                }
            }

            fetchData()
        }
    }, [fetchingFiles, list, handleError, navigate])

    // LOGOUT VIEW
    function handleLogout() {
        logic.logoutUser(error => {
            if (error) {
                handleError(error, navigate)
            }

            navigate('/')
        })
    }

    function handleRefreshOnDelete(file) {
        const fileIndex = files.indexOf(file)

        const updateFiles = files.slice(fileIndex)
        setFiles(updateFiles)
    }

    return (
        <div className="container">
            <p>~$</p>
            <p id="client-error-download">{clientError.message}</p>

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

            {pwd && (
                <span>
                    <p>You are on ~ C:\Desktop\Downloads</p>
                </span>
            )}

            {list && files.map(file => <Files key={file.id} file={file} updateFilesList={setFiles} clientError={'#client-error-download'} onDelete={() => handleRefreshOnDelete(file)} />)}
        </div>
    )
}

export default Download

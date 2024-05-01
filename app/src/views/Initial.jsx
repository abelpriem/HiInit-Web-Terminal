import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { CommandBar, Pointer } from '../utils'

function Initial() {

    // POINTER AND COMMAND STATE
    const [commandText, setCommandText] = useState('')
    const { pointer } = Pointer()

    // VIEWS
    const navigate = useNavigate()

    // ESCUCHA TECLADO Y ESCRITURA
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter') {
                navigate('/credentials')
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [navigate])

    return <>
        <div className="container">

            <div className="tittle-logo">
                <p>    ___ ___  .___ .___  _______   .___ ___________     __      __        ___               ____    _______       </p>
                <p>   /   |   \ |   ||   | \      \  |   |\__    ___/    /  \    /  \  ____ \_ |__     ___  _/_   |   \   _  \      </p>
                <p>  /    ~    \|   ||   | /   |   \ |   |  |    |       \   \/\/   /_/ __ \ | __ \    \  \/ /|   |   /  /_\  \     </p>
                <p>  \    Y    /|   ||   |/    |    \|   |  |    |        \        / \  ___/ | \_\ \    \   / |   |   \  \_/   \    </p>
                <p>   \___|_  / |___||___|\____|__  /|___|  |____|         \__/\  /   \___   |___  /     \_/  |___| /\ \_____  /    </p>
                <p>         \/                    \/                            \/        \/     \/                 \/       \/     </p>
            </div>

            <br></br>

            <div className="text">
                <p>Type 'help' to see the list of avaliable comands.</p>
                <p>Please, press 'ENTRY' to log in or sign up</p>
            </div>

            <br></br>
            <br></br>

            <div className="info">
                <p>INFORMATION</p>
                <br></br>
                <p>-----------------------------------------</p>
                <div className="info-about">
                    <p>ABOUT</p>
                    <br></br>
                    <p>👤 Abel Prieto Martín</p>
                    <p>-----------------------------------------</p>
                </div>
                <div className="info-contact">
                    <p>CONTACT</p>
                    <br></br>
                    <p>📧 abelpriem94@hotmail.com</p>
                    <a href="https://github.com/abelpriem" target="_blank">🌐 GitHub - Abel Prieto</a>
                    <a href="https://www.linkedin.com/in/abel-prieto-mart%C3%ADn-050b75b8/" target="_blank">🌐 Linkedin | Abel Prieto</a>
                    <p>-----------------------------------------</p>
                </div>
            </div>

            <br></br>
            <br></br>

            <div className="command-bar">
                <CommandBar />
                <div id="command-form">
                    <input id="command" type="text" contentEditable="true" autoFocus autoComplete="off" value={commandText} onChange={(event) => setCommandText(event.target.value)}
                        style={{ width: `${Math.max(10, commandText.length * 8)}px` }} />
                </div>
                <p>{pointer}</p>
            </div>

            <br></br>
            <br></br>

            <footer className="sign">
                <p style={{ fontSize: 'solid', fontStyle: 'italic' }}>© Copyright by Abel Prieto | Proyect ISDI Coders School</p>
            </footer>

        </div >
    </>

}

export default Initial

import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import logic from '../logic'
import session from '../logic/session'
import Context from '../Context'

export default function Commands() {
    const [role, setRole] = useState('')

    const [guestCommands, setGuestCommands] = useState([])
    const [userCommands, setUserCommands] = useState([])
    const [adminCommands, setAdminCommands] = useState([])

    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    // RETRIEVE ROLE: GUEST-USER-ADMIN
    useEffect(() => {
        if (session.token) {
            try {
                logic.retrieveUser()
                    .then(user => {
                        setRole(user.role)
                    })
            } catch (error) {
                handleError(error, navigate)
            }
        } else {
            try {
                logic.retrieveGuest()
                    .then(guest => {
                        setRole(guest.role)
                    })
            } catch (error) {
                handleError(error, navigate)
            }
        }
    }, [])

    useEffect(() => {
        try {
            logic.retrieveCommands()
                .then(commands => {

                })
        } catch (error) {

        }
    })

    return <>

        {setRole === 'guest'}
        <div className="command-style">
            <span className="command-style--username">{username}</span>
            <span className="command-style--rest">@</span>
            <span className="command-style--group">{group}</span>
            <span className="command-style--rest">-</span>
            <span style={{ color: roleColor }}>{role}</span>
            <span className="command-style--rest">:$</span>
        </div>
    </>
}


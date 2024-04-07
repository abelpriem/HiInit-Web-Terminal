import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'
import { Pointer, CommandBar } from '../utils'
import logic from '../logic'

function AssignGroup() {
    const [groups, setGroups] = useState([])
    const [users, setUsers] = useState([])
    const [fetchingGroups, setFetchingGroups] = useState(false)
    const [fetchingUsers, setFetchingUsers] = useState(false)
    const [selectedGroup, setSelectedGroup] = useState('')
    const [selectedUser, setSelectedUser] = useState('')
    const [showButton, setShowButton] = useState(false)
    const [uknownCommand, setUknownCommand] = useState(false)

    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    // RETRIEVE ALL GROUPS
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                setFetchingGroups(true)
                const result = await logic.retrieveAllGroups()

                setGroups(result)
                setFetchingGroups(false)
            } catch (error) {
                handleError(error, navigate)
                setFetchingGroups(false)
            }
        }

        fetchGroups()
    }, [handleError, navigate])

    // RETRIEVE ALL USERS
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setFetchingUsers(true)
                const result = await logic.retrieveAllUsers()

                setUsers(result)
                setFetchingUsers(false)
            } catch (error) {
                handleError(error, navigate)
                setFetchingUsers(false)
            }
        }

        fetchUsers()
    }, [handleError, navigate])

    // SHOW ASSIGN BUTTON
    useEffect(() => {
        if (selectedUser !== '') {
            setShowButton(true)
        } else {
            setShowButton(false)
        }
    }, [selectedUser])

    // ASSIGN GROUP-USER
    function handleAssignSubmit(event) {
        event.preventDefault()

        const clientError = document.querySelector('#client-error-assign-group')

        if (selectedGroup !== 'select-group' || selectedUser !== 'select-user') {
            try {
                logic.assignGroups(selectedGroup, selectedUser)
                    .then(() => {
                        clientError.innerText = 'Group succesfully assign! ✅'
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
        } else {
            clientError.innerText = 'Please, select an avaliable group or user...'
            clientError.style.color = 'tomato'

            return
        }

        document.body.addEventListener('keydown', function () {
            clientError.innerText = 'ADMIN - Assign or change groups on users: '
            clientError.style.color = '#EBDBB2'
        })
    }

    return (
        <div>
            <p>~$</p>
            <span>
                <p id="client-error-assign-group">ADMIN - Assign or change groups on users: </p>

                <br />
                <div>
                    <div className="show-list-items">
                        <select value={selectedGroup} onChange={(event) => setSelectedGroup(event.target.value)}>
                            <option value="select-group">- Select Group -</option>
                            {groups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>

                    <br />

                    <div className="show-list-items">
                        <select value={selectedUser} onChange={(event) => setSelectedUser(event.target.value)}>
                            <option value="select-user">- Select User -</option>
                            {users.map(user => (
                                <option key={user.id} value={user.id}>{user.username}</option>
                            ))}
                        </select>
                    </div>

                    {showButton && (
                        <button className="button-form" type="submit" onClick={handleAssignSubmit}>Assign</button>
                    )}
                </div>
            </span>

            {uknownCommand && (
                <span>
                    <p>shell: command not found: '{commandText}'. Entry SUDO, DESKTOP or EXIT</p>
                </span>
            )}
        </div>
    )
}

export default AssignGroup

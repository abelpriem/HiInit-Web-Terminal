import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import logic from '../logic'
import Context from '../Context'

function CreateGroup() {

    // FIELDS STATE
    const navigate = useNavigate()
    const { handleError } = useContext(Context)

    // CREATE GROUP FUNCTION
    function handleCreateGroup(event) {
        event.preventDefault()

        const clientError = document.querySelector('#client-error-newgroup')
        const group = event.target.querySelector('#newgroup').value

        console.log(typeof group)

        try {
            return logic.createGroup(group)
                .then(() => {
                    clientError.innerText = 'Group succesfully created! ✅'
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
            clientError.innerText = 'ADMIN - Create a new group: '
            clientError.style.color = '#EBDBB2'
        })
    }

    return <>
        <div>
            <p>~$</p>
            <span>
                <form className="newgroup-form" onSubmit={handleCreateGroup}>
                    <p id="client-error-newgroup">ADMIN - Create a new group: </p>

                    <div className="space-between">
                        <div className="fields">
                            <label htmlFor="newgroup"> <p style={{ color: '#18E3C8' }}>New group: </p></label>
                            <input type="text" id="newgroup" contentEditable="true" autoComplete="off" />
                        </div>
                        <button className="button-form" type="submit" >Create</button>
                    </div>

                </form>
            </span>

        </div >
    </>
}

export default CreateGroup
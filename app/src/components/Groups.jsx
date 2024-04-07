
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'
import logic from '../logic'
import Swal from 'sweetalert2'

function Groups(props) {
    const { handleError } = useContext(Context)
    const navigate = useNavigate()
    const group = props.group

    // DELETE FILES
    function handleDeleteGroup(event) {
        event.preventDefault()

        Swal.fire({
            title: "Are you want to delete it?",
            text: "This action will transfer all users to default group",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete group"
        }).then((result) => {
            if (result.isConfirmed) {

                logic.deleteGroup(group.id)
                    .then(() => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Group has been deleted",
                            icon: "success"
                        })

                        // UPDATE GROUPS
                        props.updateGroupList(prevGroups => prevGroups.filter(g => g.id !== group.id))
                    })
                    .catch(error => {
                        const clientError = document.querySelector(props.clientError)

                        clientError.innerText = `${error.message} ❌`
                        clientError.style.color = 'tomato'

                        handleError(error, navigate)
                    })
            }
        })
    }

    return <>
        <article key={group._id}>
            <ul>
                <p>{group.name}</p>
                <button id="delete-group" className='button-delete' onClick={handleDeleteGroup}>Delete</button>
            </ul>
        </article>
    </>
}

export default Groups
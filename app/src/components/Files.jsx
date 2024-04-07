import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../Context'
import session from '../logic/session'
import logic from '../logic'
import Swal from 'sweetalert2'

function Files(props) {
    const { handleError } = useContext(Context)
    const navigate = useNavigate()
    const file = props.file

    // DELETE FILES
    function handleDeleteFile(event) {
        event.preventDefault()

        const clientError = document.querySelector(props.clientError)

        Swal.fire({
            title: "Are you want to delete it?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it"
        }).then((result) => {
            if (result.isConfirmed) {

                logic.deleteFile(file.id)
                    .then(() => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        })

                        // UPDATE FILES
                        props.updateFilesList(prevFiles => prevFiles.filter(f => f.id !== file.id))
                    })
                    .catch(error => {
                        clientError.innerText = `${error.message} ❌`
                        clientError.style.color = 'tomato'

                        handleError(error, navigate)
                    })
            }
        })
    }

    // DOWNLOAD FILE
    function handleDownloadFile(event) {
        event.preventDefault()

        const clientError = document.querySelector(props.clientError)

        try {
            logic.downloadFile(file.id)
                .then(blob => {
                    const url = window.URL.createObjectURL(blob)

                    const anchor = document.createElement('a')
                    anchor.href = url
                    anchor.download = file.name
                    anchor.click()

                    window.URL.revokeObjectURL(url)

                    clientError.innerText = 'File successfully download ✅'
                    clientError.style.color = 'green'
                })
        } catch (error) {
            clientError.innerText = `${error.message} ❌`
            clientError.style.color = 'tomato'

            handleError(error, navigate)
        }
    }

    return <>
        <article>
            <ul>
                <p>{file.name}</p>
                <button className='anchor-button' onClick={handleDownloadFile}>Download</button>
                {session.sessionUserId === file.owner && (
                    <button id="delete-file" className='button-delete' onClick={handleDeleteFile}>Delete</button>
                )}
                {session.role === 'admin' && (
                    <button id="delete-file" className='button-delete' onClick={handleDeleteFile}>Delete</button>
                )}
            </ul>
        </article>
    </>
}

export default Files
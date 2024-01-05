import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { postCreateUser } from '../services/UserService'
import { toast } from 'react-toastify';


const ModalAddnew = (props) => {
    const { show, handleClose, handleUpdate } = (props)
    const [name, setName] = useState("")
    const [job, setJob] = useState("")

    const handleSaveUser = async () => {
        if (!name || !job) {
            toast.error('Name and job are required');
            return;
        }

        let res = await postCreateUser(name, job)
        if (res && res.id) {
            handleClose()
            setName("")
            setJob("")
            toast.success('Add new user succeed')
            handleUpdate({ first_name: name, id: res.id })
        } else {
            toast.error('Error...')
        }

    }

    return (
        <>
            <div
                className="modal show"
                style={{ display: 'block', position: 'initial' }}
            >
                <Modal
                    show={show}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Add new user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='body-add-new'>
                            <form>
                                <div className="form-group">
                                    <label className='form-label'>Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className='form-label'>Job</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={job}
                                        onChange={(event) => setJob(event.target.value)}
                                    />
                                </div>

                            </form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleSaveUser}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default ModalAddnew




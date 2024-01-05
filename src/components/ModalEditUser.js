import { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { putUpdateUser } from '../services/UserService'
import { toast } from 'react-toastify';


const ModalEditUser = (props) => {
    const { show, handleClose, dataUserEdit, handleEditUserFromModal } = props
    const [name, setName] = useState("")
    const [job, setJob] = useState("")

    const handleEditUser = async () => {
        if (!name) {
            toast.error('Name are required');
            return;
        }
        let res = await putUpdateUser(name, job)
        if (res && res.updatedAt) {
            handleEditUserFromModal({
                first_name: name,
                id: dataUserEdit.id
            })

            handleClose()
            toast.success('Updated user succeed')
        }
    }

    useEffect(() => {
        if (show) {
            setName(dataUserEdit.first_name)

        }
    }, [dataUserEdit])



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
                        <Modal.Title>Edit a user</Modal.Title>
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
                        <Button variant="primary" onClick={handleEditUser}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default ModalEditUser




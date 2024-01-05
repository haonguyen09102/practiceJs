import { Modal, Button } from 'react-bootstrap';
import { deleteUser } from '../services/UserService'
import { toast } from 'react-toastify';


const ModalConfirm = (props) => {
    const { show, handleClose, dataUserDelete, handleDeleteUserFromModal } = (props)

    const confirmDelete = async () => {
        let res = await deleteUser(dataUserDelete.id)
        if (res && +res.statusCode === 204) {
            handleDeleteUserFromModal(dataUserDelete)
        } else {
            toast.error('Delete fail');
        }
        handleClose()
        toast.success('Delete succeed')
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
                        <Modal.Title>Delete user</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='body-add-new'>
                            Are u sure delete this user?
                            <br></br>
                            <b>{dataUserDelete.email}</b>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose()}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={() => confirmDelete()}>
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    )
}

export default ModalConfirm




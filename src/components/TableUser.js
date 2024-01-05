import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddnew from './ModalAddnew';
import ModalEditUser from './ModalEditUser';
import ModalConfirm from './ModalConfirm';
import _ from "lodash";


const TableUser = (props) => {

    const [listUsers, setlistUsers] = useState([])
    const [totalUser, seTotalUser] = useState([0])
    const [totalPages, setTototalPages] = useState([0])

    const [isShowModalAddnew, setisShowmodalAddnew] = useState(false)
    const [isShowModalEdit, setisShowModalEdit] = useState(false)
    const [dataUserEdit, setdataUserEdit] = useState({})

    const [isShowModalDelete, setisShowModalDelete] = useState(false)

    const [dataUserDelete, setdataUserDelete] = useState({})

    const handleClose = () => {
        setisShowmodalAddnew(false)
        setisShowModalEdit(false)
        setisShowModalDelete(false)
    }

    const handleUpdate = (user) => {
        setlistUsers([user, ...listUsers])
    }

    const handleEditUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers)
        let index = listUsers.findIndex(item => item.id === user.id)
        cloneListUsers[index].first_name = user.first_name
        setlistUsers(cloneListUsers)
    }

    useEffect(() => {

        getUsers(1)
    }, [])

    const getUsers = async (page) => {
        let res = await fetchAllUser(page)

        if (res && res.data) {
            console.log(res)
            seTotalUser(res.total)
            setlistUsers(res.data)
            setTototalPages(res.total_pages)
        }

    }

    const handlePageClick = (event) => {
        getUsers(+event.selected + 1)
    }

    const handleEditUser = (user) => {
        setdataUserEdit(user)
        setisShowModalEdit(true)
    }

    const handleDeleteUser = (user) => {
        setisShowModalDelete(true)
        setdataUserDelete(user)
    }

    const handleDeleteUserFromModal = (user) => {
        let cloneListUsers = _.cloneDeep(listUsers)
        cloneListUsers = cloneListUsers.filter(item => item.id !== user.id)
        setlistUsers(cloneListUsers)
    }

    return (<>
        <div className='my-3 add-new'>
            <span><b>List user:</b></span>
            <button className="btn btn-success" onClick={() => setisShowmodalAddnew(true)}>Add new user</button>
        </div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    listUsers && listUsers.length > 0 &&
                    listUsers.map((item, index) => {
                        return (
                            <tr key={`user - ${index}`}>
                                <td>{item.id}</td>
                                <td>{item.email}</td>
                                <td>{item.first_name}</td>
                                <td>{item.last_name}</td>
                                <td>
                                    <button
                                        className='btn btn-warning mx-3'
                                        onClick={() => handleEditUser(item)}
                                    >
                                        Edit</button>
                                    <button
                                        className='btn btn-danger'
                                        onClick={() => handleDeleteUser(item)}
                                    >Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }

            </tbody>
        </Table>
        <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={totalPages}
            previousLabel="< previous"

            pageClassName='page-item'
            pageLinkClassName='page-link'
            previousClassName='page-item'
            previousLinkClassName='page-link'
            nextClassName='page-item'
            nextLinkClassName='page-link'
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName='pagination'
            activeClassName='active'
        />
        <ModalAddnew
            show={isShowModalAddnew}
            handleClose={handleClose}
            handleUpdate={handleUpdate}
        />
        <ModalEditUser
            show={isShowModalEdit}
            dataUserEdit={dataUserEdit}
            handleClose={handleClose}
            handleEditUserFromModal={handleEditUserFromModal}

        />
        <ModalConfirm
            show={isShowModalDelete}
            handleClose={handleClose}
            dataUserDelete={dataUserDelete}
            handleDeleteUserFromModal={handleDeleteUserFromModal}
        />
    </>)
}

export default TableUser
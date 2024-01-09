import Table from 'react-bootstrap/Table';
import { useEffect, useState } from 'react';
import { fetchAllUser } from '../services/UserService';
import ReactPaginate from 'react-paginate';
import ModalAddnew from './ModalAddnew';
import ModalEditUser from './ModalEditUser';
import ModalConfirm from './ModalConfirm';
import { CSVLink, CSVDownload } from "react-csv";
import Papa from 'papaparse';
import { toast } from 'react-toastify';
import _ from "lodash";
import { debounce } from "lodash"
import './TableUser.scss'


const TableUser = (props) => {

    const [listUsers, setlistUsers] = useState([])
    const [totalUser, seTotalUser] = useState([0])
    const [totalPages, setTototalPages] = useState([0])

    const [isShowModalAddnew, setisShowmodalAddnew] = useState(false)
    const [isShowModalEdit, setisShowModalEdit] = useState(false)
    const [dataUserEdit, setdataUserEdit] = useState({})

    const [isShowModalDelete, setisShowModalDelete] = useState(false)

    const [dataUserDelete, setdataUserDelete] = useState({})

    const [sortBy, setsortBy] = useState("asc")

    const [sortField, setsortField] = useState("id")

    const [keyword, setkeyword] = useState("")

    const [dataExport, setDataExport] = useState([])

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

    const handleShort = (sortBy, sortField) => {
        setsortBy(sortBy);
        setsortField(sortField)
        let cloneListUsers = _.cloneDeep(listUsers)
        cloneListUsers = _.orderBy(cloneListUsers, [sortField], [sortBy]);
        setlistUsers(cloneListUsers)
    }

    const handleSearch = debounce((event) => {
        let term = (event.target.value)
        if (term) {
            let cloneListUsers = _.cloneDeep(listUsers)
            cloneListUsers = cloneListUsers.filter(item => item.email.includes(term))
            setlistUsers(cloneListUsers)
        } else {
            getUsers(1)
        }
    }, 300)

    const getUsersExport = (event, done) => {
        let result = []
        if (listUsers && listUsers.length > 0) {
            result.push(["ID", "Email", "First Name", "Last Name"])
            listUsers.map((item, index) => {
                let arr = []
                arr[0] = item.id
                arr[1] = item.email
                arr[2] = item.first_name
                arr[3] = item.last_name
                result.push(arr)
            })

            setDataExport(result)
            done()
        }
    }

    const handleImportCSV = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            let file = event.target.files[0]

            if (file.type !== "text/csv") {
                toast.error('only csv files')
                return
            }
            if (file.size > 1000) {
                toast.error('csv file over capacity')
                return
            }
            // Parse local CSV file
            Papa.parse(file, {
                // header: true,
                complete: function (results) {
                    let rawCSV = results.data
                    if (rawCSV.length > 0) {
                        if (rawCSV[0] && rawCSV[0].length === 3) {
                            if (rawCSV[0][0] !== "email" || rawCSV[0][1] !== "first_name" || rawCSV[0][2] !== "last_name"
                            ) {
                                toast.error('Wrong format csv header')
                            } else {
                                let result = []

                                rawCSV.map((item, index) => {
                                    if (index > 0 && item.length === 3) {
                                        let obj = {}
                                        obj.email = item[0]
                                        obj.first_name = item[1]
                                        obj.last_name = item[2]
                                        result.push(obj)

                                    }
                                })
                                setlistUsers(result)

                            }
                        } else {
                            toast.error('Wrong format csv file')
                        }
                    } else {
                        toast.error('Not found data on csv file!')
                    }

                }
            });
        }

    }


    return (<>
        <div className='my-3 add-new d-sm-flex'>
            <span className=''><b>List user:</b></span>
            <div className='grp-btn mt-sm-0 mt-2'>
                <label htmlFor='test' className='btn btn-warning'>
                    <i className="fa-solid fa-file-import"></i> Import</label>
                <input
                    id='test' type='file' hidden
                    onChange={(event) => handleImportCSV(event)}
                />

                <CSVLink
                    data={dataExport}
                    filename={"user.csv"}
                    className="btn btn-primary"
                    asyncOnClick={true}
                    onClick={(event, done) => getUsersExport(event, done)}
                ><i className="fa-solid fa-file-arrow-down"></i> Export</CSVLink>

                <button className="btn btn-success" onClick={() => setisShowmodalAddnew(true)}>
                    <i className="fa-solid fa-circle-plus"></i> Add new
                </button>
            </div>
        </div>
        <div className='col-12 col-sm-4 my-3'>
            <input
                className='form-control'
                placeholder='Search here'
                // value={keyword}
                onChange={(event) => handleSearch(event)}
            />
        </div>
        <div className='customize-table'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            <div className='sort-header'>
                                <span>ID</span>
                                <span>
                                    <i
                                        className="fa-solid fa-arrow-down"
                                        onClick={() => handleShort("desc", "id")}
                                    >
                                    </i>
                                    <i
                                        className="fa-solid fa-arrow-up"
                                        onClick={() => handleShort("asc", "id")}
                                    >
                                    </i>
                                </span>
                            </div>

                        </th>
                        <th>Email</th>
                        <th>
                            <div className='sort-header'>
                                <span>First Name</span>
                                <span>
                                    <i
                                        className="fa-solid fa-arrow-down"
                                        onClick={() => handleShort("desc", "first_name")}
                                    >
                                    </i>
                                    <i
                                        className="fa-solid fa-arrow-up"
                                        onClick={() => handleShort("asc", "first_name")}
                                    >
                                    </i>
                                </span>
                            </div>

                        </th>
                        <th >Last Name</th>
                        <th >Actions</th>
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
        </div>
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
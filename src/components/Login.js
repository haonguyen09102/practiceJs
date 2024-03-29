import { useEffect, useState, useContext } from "react"
import { UserContext } from '../Context/Usercontext';
import { loginApi } from "../services/UserService"
import "./Login.scss"
import { toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate()
    const { loginContext } = useContext(UserContext);

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isShowPass, setIsShowPass] = useState(false)
    const [showLoading, setShowLoading] = useState(false)

    useEffect(() => {
        let token = localStorage.getItem("token")
        if (token) {
            navigate("/");
        }
    }, [])

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error("Email or password is empty")
        }
        setShowLoading(true)
        let res = await loginApi(email.trim(), password)
        if (res && res.token) {
            loginContext(email, res.token)
            navigate("/")

        } else {
            //error
            if (res && res.status === 400) {
                toast.error(res.data.error)
            }
        }
        setShowLoading(false)
    }

    const handleBack = () => {
        navigate("/")
    }

    const handlePressEnter = (event) => {
        if (event && event.key === "Enter") {
            handleLogin()
        }

    }

    return (<>
        <div className="login-container col-12 col-sm-4">
            <div className="title">
                Log in
            </div>
            <div className="text">
                Email or username(eve.holt@reqres.in,)
            </div>
            <input
                type="text"
                placeholder="Email or username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
            />
            <div className="input-pass">
                <input
                    type={isShowPass === true ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    onKeyDown={(event) => handlePressEnter(event)}

                />
                <i className={isShowPass === true ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                    onClick={() => setIsShowPass(!isShowPass)}
                ></i>
            </div>
            <button
                className={email && password ? "active" : ""}
                disabled={email && password ? false : true}
                onClick={() => handleLogin()}
            >
                {showLoading && <i className="fa-solid fa-spinner fa-spin-pulse"></i>}
                <span>  Login</span>
            </button>
            <div className="back">
                <i className="fa-solid fa-circle-left"></i>
                <span onClick={() => handleBack()}>&nbsp;
                    Go back
                </span>
            </div>
        </div>
    </>)
}

export default Login
import { Routes, Route, Link } from "react-router-dom";
import Home from '../components/Home';
import TableUser from '../components/TableUser';
import Login from '../components/Login';
import Privateroutes from "./Privateroutes";
import NotFound from "./Notfound";

const Approutes = () => {
    return (<>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route
                path="/users"
                element={
                    <Privateroutes>
                        <TableUser />
                    </Privateroutes>
                }
            />
            <Route path="*" element={<NotFound />} />
        </Routes>
        {/* <Privateroutes path="/users">
            <TableUser />
        </Privateroutes> */}
    </>)
}

export default Approutes
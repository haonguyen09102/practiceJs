import { Routes, Route, Link } from "react-router-dom";
import { useContext } from 'react';
import { UserContext } from '../Context/Usercontext';
import { Alert } from "react-bootstrap";

const Privateroutes = (props) => {

    const { user, } = useContext(UserContext);
    if (user && !user.auth) {
        return (<>

            <Alert variant="danger" className="mt-3">
                <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                <p>
                    You dont have permission to acess this route
                </p>
            </Alert>

        </>)
    }

    return (<>

        {props.children}

    </>)
}

export default Privateroutes
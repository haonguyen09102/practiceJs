import './App.scss';
import Header from './components/header';
import Container from 'react-bootstrap/Container';
import { ToastContainer, toast } from 'react-toastify';
import { useContext, useEffect } from 'react';
import { UserContext } from './Context/Usercontext';
import Approutes from './routes/Approutes';


function App() {

  const { user, loginContext } = useContext(UserContext);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      loginContext(localStorage.getItem("email"), localStorage.getItem("token"))
    }
  }, [])


  return (
    <>

      <div className='app-container'>
        <Header />
        <Container>
          <Approutes />
        </Container>


        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

      </div>
    </>
  );
}

export default App;

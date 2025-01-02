import './App.css';
import Header from './Components/Header/Header';
import LoginPopup from './Components/LoginPopup/LoginPopup';
import { StoreContext } from './StoreContext/StoreContext';
import { useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css'; 
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './Pages/Home/Home';
import EventDetails from './Pages/EventDetails/EventDetails';

function App() {
  const { showLogin } = useContext(StoreContext);

  return (
    <Router>
      <>
        {showLogin && <LoginPopup />}
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventDetails/>} />
        </Routes>
      </>
    </Router>
  );
}

export default App;

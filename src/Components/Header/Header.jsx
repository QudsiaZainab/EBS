import React, { useState } from 'react';
import './Header.css';
import { StoreContext } from '../../StoreContext/StoreContext';
import { useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';  // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css';  // Import the toastify styles
import { Link } from 'react-router-dom';

const Header = () => {
    const { setShowLogin, token, setToken } = useContext(StoreContext); // Access token and logout function from context
    const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown visibility

    const handleLogout = () => {
        setToken(null); 
        setDropdownOpen(false); // Close dropdown after logout
        localStorage.removeItem('token'); // Remove token from local storage
        
        // Show success toast message
        toast.success('Logged out successfully');
    };

    return (
        <header id="header">
            <Link to = '/' id="logo">EBS</Link>
            {token ? (
                <div
                    className="user-menu"
                    onMouseEnter={() => setDropdownOpen(true)} // Open dropdown on hover
                    onMouseLeave={() => setDropdownOpen(false)} // Close dropdown when mouse leaves
                >
                    <FaUserCircle className="user-icon" />
                    {dropdownOpen && ( // Show dropdown only when open
                        <div className="dropdown">
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            ) : (
                <button onClick={() => setShowLogin(true)}>Login</button> // Display login button
            )}
        </header>
    );
};

export default Header;

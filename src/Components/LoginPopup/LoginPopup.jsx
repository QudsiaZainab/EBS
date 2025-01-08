import React, { useContext, useState, useEffect } from 'react';
import './LoginPopup.css';
import axios from 'axios';
import { StoreContext } from '../../StoreContext/StoreContext';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  
import Loader from '../Loader/Loader';

const LoginPopup = () => {
    const { url, setToken, setShowLogin,  token } = useContext(StoreContext);
    const [data, setData] = useState({
        username: "",  
        email: "",
        password: "",
        confirmPassword: "",  
    });
    const [currState, setCurrState] = useState("Login");
    const [loading, setLoading] = useState(false); 
    const [serverErrors, setServerErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        general: ""
    });

    // Handle form input changes
    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    };

    // Scroll to the top when the component is mounted or shown
    useEffect(() => {
        window.scrollTo(0, 0); // This will scroll the page to the top
    }, []);  // Empty dependency array ensures this runs only once when the component is mounted

    const onLogin = async (event) => {
        event.preventDefault();
        
        // Check if password and confirm password match during signup
        if (currState === "Sign Up" && data.password !== data.confirmPassword) {
            setServerErrors({
                ...serverErrors,
                confirmPassword: "Passwords do not match"
            });
            return;
        }
    
        let newUrl = url;
        if (currState === "Login") {
            newUrl += "/api/auth/login";
        } else {
            newUrl += "/api/auth/signup";
        }
    
        setLoading(true);  // Set loading to true when request starts
    
        try {
            console.log("Sending request to:", newUrl);  // Log the URL
            const response = await axios.post(newUrl, data);
    
            console.log("Response received:", response);  // Log the response object
            setLoading(false);  // Set loading to false when request finishes
    
            if ((response.status === 200 || response.status === 201) && response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
                setServerErrors({ email: "", password: "", confirmPassword: "", general: "" });
    
                // Display success message using react-toastify
                toast.success(response.data.message || `${currState} successful!`);
                console.log(token);
            } else {
                // Handle backend validation errors
                const errorMessage = response.data.message;
    
                setServerErrors({
                    email: errorMessage.includes('email') ? errorMessage : "",
                    password: errorMessage.includes('password') ? errorMessage : "",
                    confirmPassword: errorMessage.includes('confirmPassword') ? errorMessage : "",
                    general: !errorMessage.includes('email') && !errorMessage.includes('password') && !errorMessage.includes('confirmPassword') ? errorMessage : ""
                });
            }
            
        } catch (error) {
            setLoading(false);  // Set loading to false in case of error
            console.error("Error occurred during request:", error);  // Log the error in the catch block
    
            if (error.response) {
                // If the server returned a response (but it's an error status like 400)
                console.log("Response error:", error.response.data);
                setServerErrors({
                    general: error.response.data.message || 'Something went wrong. Please try again later.'
                });
    
            } else if (error.request) {
                // If the request was made but no response was received
                console.log("No response received:", error.request);
                setServerErrors({
                    general: 'No response from the server. Please check your network connection.'
                });
            } else {
                // Something else went wrong
                console.log("Error during request setup:", error.message);
                setServerErrors({
                    general: 'An unexpected error occurred. Please try again later.'
                });
            }
        }
    };
    

    return (
        <div className='login-popup'>
            <form className="login-popup-container" onSubmit={onLogin}>
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <FaTimes id="cross" onClick={() => setShowLogin(false)} />
                </div>
                <div className="login-popup-inputs">
                    {currState === 'Sign Up' && (
                        <input
                            type="text"
                            name="username"  // Correct field name
                            onChange={onChangeHandler}
                            value={data.username}
                            placeholder="Your Name"
                            required
                        />
                    )}
                    <input
                        type="email"
                        name="email"
                        onChange={onChangeHandler}
                        value={data.email}
                        placeholder="Your Email"
                        required
                    />
                    {serverErrors.email && <p className="error">{serverErrors.email}</p>}

                    <input
                        type="password"
                        name="password"
                        onChange={onChangeHandler}
                        value={data.password}
                        placeholder="Password"
                        required
                    />
                    {serverErrors.password && <p className="error">{serverErrors.password}</p>}

                    {currState === 'Sign Up' && (
                        <input
                            type="password"
                            name="confirmPassword"
                            onChange={onChangeHandler}
                            value={data.confirmPassword}
                            placeholder="Confirm Password"
                            required
                        />
                    )}
                    {serverErrors.confirmPassword && <p className="error">{serverErrors.confirmPassword}</p>}
                </div>

                <button type="submit">{currState === 'Sign Up' ? 'Create Account' : 'Login'}</button>

                {serverErrors.general && <p className="error general-error">{serverErrors.general}</p>}

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use and privacy policy.</p>
                </div>

                {currState === 'Login' ? (
                    <p>Create a new account? <span onClick={() => setCurrState("Sign Up")}>Click here</span></p>
                ) : (
                    <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
                )}
                {loading && <Loader/>}

            </form>
        </div>
    );
};

export default LoginPopup;

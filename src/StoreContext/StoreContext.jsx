import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(""); 
    const url = "https://ebs-backend-3d2o.vercel.app";
    const navigate = useNavigate();  // Redirect handler

    // Save token with expiration date
    const saveToken = (newToken) => {
        const expirationTime = new Date().getTime() + 7 * 24 * 60 * 60 * 1000; 
        localStorage.setItem("token", newToken);
        localStorage.setItem("tokenExpiration", expirationTime.toString());
        setToken(newToken);
    };

    // Logout function to clear token and redirect
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenExpiration");
        setToken("");
        navigate("/login"); // Redirect user to the login page
    };

    // Check token validity on load and auto logout if expired
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedExpiration = localStorage.getItem("tokenExpiration");

        if (storedToken && storedExpiration) {
            const currentTime = new Date().getTime();
            if (currentTime < parseInt(storedExpiration)) {
                setToken(storedToken);  // Token valid
            } else {
                logout(); // Token expired, log out the user
            }
        }
    }, []);

    // Token check before each request (optional)
    const checkTokenBeforeRequest = () => {
        const storedExpiration = localStorage.getItem("tokenExpiration");
        const currentTime = new Date().getTime();

        if (!storedExpiration || currentTime > parseInt(storedExpiration)) {
            logout();  // Token expired, logout the user
            return false;
        }
        return true;
    };

    const contextValue = {
        url,
        token,
        setToken: saveToken, 
        showLogin,
        setShowLogin,
        logout,  // Added logout function to the context
        checkTokenBeforeRequest,  // Added request validation function
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;

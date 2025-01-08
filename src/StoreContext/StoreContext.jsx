import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(""); // Token state
    const url = "https://ebs-backend-3d2o.vercel.app";

    // Load token and userId from localStorage when the app initializes
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const tokenExpiry = localStorage.getItem("tokenExpiry");
        
        const checkTokenExpiry = () => {
            const currentTime = Date.now();
            if (tokenExpiry && currentTime > parseInt(tokenExpiry, 10)) {
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiry");
                setToken(null);
            }
        };

        if (storedToken) {
            setToken(storedToken); // Update the token state if token exists
        }

        const interval = setInterval(checkTokenExpiry, 1000);
        return () => clearInterval(interval);
        
    }, [token]);



    const setTokenWithExpiry = (newToken) => {
        setToken(newToken);
        const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000;
        localStorage.setItem("token", newToken);
        localStorage.setItem("tokenExpiry", expiryTime.toString());
    };

    const contextValue = {
        url,
        token,
        setToken: setTokenWithExpiry,
        showLogin,
        setShowLogin,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider; 
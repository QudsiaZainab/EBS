import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState(""); // Token state
    const url = "https://ebs-backend-3d2o.vercel.app";

    // Load token and userId from localStorage when the app initializes
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        
        if (storedToken) {
            setToken(storedToken); // Update the token state if token exists
        }
        
    }, [token]);



    const contextValue = {
        url,
        token,
        setToken,
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

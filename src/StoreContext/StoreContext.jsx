import { createContext, useState, useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken] = useState("");
    const url = "https://ebs-backend-3d2o.vercel.app";

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const tokenExpiry = localStorage.getItem("tokenExpiry");
        const currentTime = Date.now();

        if (storedToken && tokenExpiry) {
            if (currentTime > parseInt(tokenExpiry, 10)) {
                localStorage.removeItem("token");
                localStorage.removeItem("tokenExpiry");
                setToken("");
            } else {
                setToken(storedToken);
            }
        }
    }, []);

    const setTokenWithExpiry = (newToken) => {
        setToken(newToken);
        const expiryTime = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
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

import { useEffect, useState, useContext, createContext } from "react";
import axios from "axios";
import { apiUrl } from "./api/api.config";

const authContext = createContext();

// provider hook that creates auth object and handles state
const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    // login, store and set the user info from response
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/login`, {
                email,
                password,
            });
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            setUser(response.data);
            setError(null);
        } catch (error) {
            const errMsg =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            setError(errMsg);
        }
    };

    // signup, store and set the user info from response
    const signup = async (email, password, firstName, lastName, affiliation) => {
        try {
            const response = await axios.post(`${apiUrl}/auth/signup`, {
                email,
                password,
                firstName,
                lastName,
                affiliation,
            });
            localStorage.setItem("userInfo", JSON.stringify(response.data));
            setUser(response.data);
            setError(null);
            return response.data;
        } catch (error) {
            const errMsg =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            setError(errMsg);
        }
    };

    const logout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
    };

    const setConfig = () => {
        return {
            headers: { "x-auth-token": user.token },
        };
    };

    // get userInfo on mount from browser sotrage if not already set ...
    // ... useAuth mounts when imported and assigned
    useEffect(() => {
        if (!user) {
            const userInfoFromLocal = localStorage.getItem("userInfo")
                ? JSON.parse(localStorage.getItem("userInfo"))
                : null;
            setUser(userInfoFromLocal);
        }
    }, [user]);

    // Return the user object and auth methods
    return {
        user,
        error,
        login,
        signup,
        logout,
        setConfig,
    };
};

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
    return useContext(authContext);
};

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export const ProvideAuth = ({ children }) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

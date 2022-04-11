import { useState, useContext, createContext } from "react";
import authApi from "./api/auth";

const authContext = createContext();

// Provider hook that creates auth object and handles state
const useProvideAuth = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
        try {
            const response = await authApi.login(email, password);
            setUser(response.user);
            setError(null);
            return response.user;
        } catch (error) {
            const errMsg =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            setError(errMsg);
        }
    };

    const signup = async (email, password) => {
        try {
            const response = await authApi.signup(email, password);
            setUser(response.user);
            setError(null);
            return response.user;
        } catch (error) {
            const errMsg =
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message;
            setError(errMsg);
        }
    };

    const signout = () => {
        return setUser(null);
    };

    // Return the user object and auth methods
    return {
        user,
        error,
        login,
        signup,
        signout,
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

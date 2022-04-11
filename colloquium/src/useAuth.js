import { useState, useContext, createContext } from "react";
import authApi from "./api/auth";

const authContext = createContext();

// Provider hook that creates auth object and handles state
const useProvideAuth = () => {
    const [user, setUser] = useState(null);

    const login = (email, password) => {
        return authApi.login(email, password).then((response) => {
            setUser(response.user);
            return response.user;
        });
    };

    const signup = (email, password) => {
        return authApi.signup(email, password).then((response) => {
            setUser(response.user);
            return response.user;
        });
    };

    const signout = () => {
        return setUser(null);
    };

    // Return the user object and auth methods
    return {
        user,
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

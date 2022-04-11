import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../useAuth";

// Make sure auth is set before rendering a page
const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
    const auth = useAuth();

    return (
        <Route
            {...restOfProps}
            render={(props) => (auth.user ? <Component {...props} /> : <Redirect to="/" />)}
        />
    );
};

export default ProtectedRoute;

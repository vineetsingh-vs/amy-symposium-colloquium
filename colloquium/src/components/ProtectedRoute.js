import { useLocation, Redirect, Route } from "react-router-dom";
import { useAuth } from "../useAuth";

// make sure auth is set before rendering a page
const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
    const auth = useAuth();
    const location = useLocation();

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                auth.user ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: "/", state: { path: location.pathname } }} />
                )
            }
        />
    );
};

export default ProtectedRoute;

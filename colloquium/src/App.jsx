import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminDashboard from "./views/AdminDashboard";
import PageNotFound from "./views/PageNotFound";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="mainContainer">
                <Switch>
                    <Route exact path="/" component={AdminDashboard} />
                    <Route path="*" component={PageNotFound} />
                </Switch>
            </div>
        </Router>
    );
}

export default App;

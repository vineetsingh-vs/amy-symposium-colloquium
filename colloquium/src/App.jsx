import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminDashboard from "./views/AdminDashboard";
import PageNotFound from "./views/PageNotFound";
import "./App.css";

function App() {
    return (
        <Router>
            <div className="mainContainer">
                <Switch>
                    {/* Admin Page of Users */}
                    <Route exact path="/admin" component={AdminDashboard} />
                    <Route path="*" component={PageNotFound} />

                    {/* Log in Page */}
                    {/* <Route exact path="/" components={LoginView} /> */}

                    {/* Document and Comments */}
                    {/* <Route exact path="/:paperId" component={DocumentView} /> */}

                    {/* Review Page containing all Comments + overall Reviews */}
                    {/* <Route exact path="/:paperId/reviews" component={ReviewView} /> */}

                    {/* <Route exact path="/:paperId/comments" component={CommentView} /> */}

                    {/* Main User Screens */}
                    {/* <Route exact path="/published" component={PublishView} /> */}
                    {/* <Route exact path="/shared" component={SharedView} /> */}
                    {/* <Route exact path="/mypapers" component={MyPapersView} /> */}

                    {/* "Popup screens" */}
                    {/* <Route exact path="/:paperId/share" components={SharingView} /> */}
                    {/* <Route exact path="/:paperId/reupload" components={ReuploadView} /> */}
                    {/* <Route exact path="/upload" components={UploadPaperView} /> */}

                </Switch>
            </div>
        </Router>
    );
}

export default App;

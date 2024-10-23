import {AuthProvider, useAuthContext} from "@asgardeo/auth-react";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import "./App.css";
import {default as authConfig} from "./config.json";
import {ErrorBoundary} from "./error-boundary";
import {HomePage, NotFoundPage} from "./pages";

const AppContent = () => {
    const {error} = useAuthContext();

    return (
        <ErrorBoundary error={error}>
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="*" element={<NotFoundPage/>}/>
                </Routes>
            </Router>
        </ErrorBoundary>
    );
};

const App = () => (
    <AuthProvider config={authConfig}>
        <AppContent/>
    </AuthProvider>
);

export default App;

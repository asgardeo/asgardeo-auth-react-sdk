import { AuthProvider, useAuthContext } from "@asgardeo/auth-react";
import config from "./config.json";
import { FunctionComponent, ReactElement } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ErrorBoundary } from "./error-boundary";
import { HomePage } from "./pages/home";
import { NotFoundPage } from "./pages/404";

const AppContent: FunctionComponent = (): ReactElement => {
  const { error } = useAuthContext();

  return (
    <ErrorBoundary error={error}>
    <Router>
          <Routes>
              <Route path="/" element={ <HomePage /> } />
              <Route element={ <NotFoundPage /> } />
          </Routes>
      </Router>
    </ErrorBoundary>
  )
};

function App() {
  return (
    <AuthProvider config={config}>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

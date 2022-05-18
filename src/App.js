//styles
import styles from "./App.module.css";

//pages
import Home from "./pages/Home";
import City from "./pages/City";
import Login from "./pages/Login";
import AdminPanel from "./pages/admin";

//hooks
import { useAuthContext } from "./hooks/useAuthContext";

//components
import DescModal from "./components/DescModal/DescModal";

//routes
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";

function App() {
  const { user, authIsReady } = useAuthContext();
  return (
    <div className={styles.container}>
      {authIsReady && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />

            {
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/admin" />}
              />
            }

            <Route path="/city/:city" element={<City />} />

            <Route path="/city/:city/description" element={<DescModal />} />

            <Route
              path="/admin"
              element={user ? <AdminPanel /> : <Navigate to="/login" />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}

export default App;

//routas till <Navigate to="/404" /> sen
export function NotFound() {
  return <h1 style={{ fontSize: 40, margin: "3rem" }}>NOT FOUND</h1>;
}

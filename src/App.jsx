import { useState } from "react";
import Room from "./pages/Room";
import "./App.css";
import "./index.css";
import { AuthProvider } from "./utils/AuthContax";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PriveteRoutes from "./componants/PriveteRoutes";
import RegisterPage from "./pages/RegisterPage";
function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage/>} />
            <Route element={<PriveteRoutes />}>
              <Route path="/" element={<Room />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;

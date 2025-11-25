import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/dashboard/Dashboard";
import {useState} from "react";
import NavBar from "./components/NavBar";
import PrescriptionForm from "./components/prescriptionform/PrescriptionForm";

function App() {
    const [user, setUser] = useState({
        loggedIn: false,
        role: null,
    });
    const handleLogout = () => {
        setUser({ loggedIn: false, role: null });
    };
    return (
        <BrowserRouter>
            <NavBar user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/login" element={<Login setUser={setUser}/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/prescribe" element={<PrescriptionForm />} />

            </Routes>
        </BrowserRouter>
    )
}

export default App;
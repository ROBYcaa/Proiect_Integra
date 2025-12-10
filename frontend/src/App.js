import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/dashboard/Dashboard";
import {useEffect, useState} from "react";
import NavBar from "./components/NavBar";
import PrescriptionForm from "./components/prescriptionform/PrescriptionForm";
import Treatments from "./components/treatments/Treatments";
import Export from "./components/export/Export";


function App() {
    const [user, setUser] = useState({
        loggedIn: false,
        role: null,
        email: null,
    });
    useEffect(() => {
        const token = localStorage.getItem("token");
        const email = localStorage.getItem("email");
        const role = localStorage.getItem("role");

        if (token && email && role) {
            setUser({
                loggedIn: true,
                role: role,
                email: email
            });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("role");
        localStorage.removeItem("currentUserId");

        setUser({ loggedIn: false, role: null, email: null });
    };

    return (
        <BrowserRouter>
            <NavBar user={user} onLogout={handleLogout} />
            <Routes>
                <Route path="/login" element={<Login setUser={setUser}/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
                <Route path="/prescribe" element={<PrescriptionForm />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/export" element={<Export />} />


            </Routes>
        </BrowserRouter>
    )
}

export default App;
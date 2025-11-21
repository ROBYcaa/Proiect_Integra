import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/dashboard/Dashboard";
import {useState} from "react";
import NavBar from "./components/NavBar";
function App() {
    const [user, setUser] = useState({
        loggedIn: false,
        role: null, // "doctor" sau "patient"
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
            </Routes>
        </BrowserRouter>
    )
}

export default App;
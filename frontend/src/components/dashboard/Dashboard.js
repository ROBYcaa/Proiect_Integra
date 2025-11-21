import React, { useEffect, useState } from "react";
import { getPatients } from "../../api/api";
import "./Dashboard.css";

function PatientDetails({ patient }) {
    return (
        <div className="patient-details">
            <h3>{patient.lastName} {patient.firstName}</h3>
            <p>Height: {patient.height}</p>
            <p>Weight: {patient.weight}</p>
            <p>Varsta: {patient.age}</p>
            <p>Sex: {patient.sex}</p>
            <p>Extra info: {patient.extrainfo}</p>
            <button
                className="treatment-button"
                onClick={() => console.log(`Vezi tratamente pentru ${patient.id}`)}
            >
                Vezi tratamente
            </button>
        </div>
    );
}

function Dashboard() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                console.log("Pacienti:", data);  //  vezi aici dacă există id
                setPatients(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter(p =>
        p.lastName.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <p>Se încarcă pacienții...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    const doctorEmail = localStorage.getItem("email");

    return (
        <div className="dashboard">
            <div className="doctor-info">
                <h1>Hello, {doctorEmail}</h1>

                <div className="stats-container">
                    <div className="stat-box">
                        <h3>Total Pacienți</h3>
                        <p>{patients.length}</p>
                    </div>

                    <div className="stat-box">
                        <h3>Active Treatments</h3>
                        <p>0</p> {/* mock data */}
                    </div>

                    <div className="stat-box">
                        <h3>Average Progress</h3>
                        <p>0%</p> {/* mock data */}
                    </div>
                </div>

            </div>

            <h2>Dashboard Doctor</h2>

            <input
                type="text"
                placeholder="Caută pacient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            <ul className="patient-list">
                {filteredPatients.map(p => (
                    <li key={p.id} className={`patient-item`}>
                        <PatientDetails patient={p} />
                    </li>

                ))}
            </ul>

        </div>
    );
}

export default Dashboard;
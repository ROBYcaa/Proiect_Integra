import React, { useEffect, useState  } from "react";
import { getPatients } from "../../api/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { getTreatments } from "../../api/api";

function PatientDetails({ patient, handlePrescribe }) {
    const navigate = useNavigate();

    return (
        <div className="patient-details">
            <h3>{patient.lastName} {patient.firstName}</h3>

            <p>Height: {patient.height}</p>
            <p>Weight: {patient.weight}</p>
            <p>Date of Birth: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
            <p>Sex: {patient.sex}</p>
            <p>Extra info: {patient.extrainfo}</p>

            <button
                className="treatment-button"
                onClick={() => handlePrescribe(patient.id)}
            >
                Vezi tratamente
            </button>
            <button
                className="chat-button"
                onClick={() => navigate(
                    `/chat/${patient.userId}`,
                    {state: {otherUserName: `${patient.lastName} ${patient.firstName}`}}
                )}
            >
                Chat
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
    const navigate = useNavigate();
    const [numberOfTreatments, setNumberOfTreatments] = useState(0);
    const doctorId = localStorage.getItem("currentUserId");


    const handlePrescribe = (id) => {
        navigate(`/treatments?patientId=${id}`);
    };

    useEffect(() => {
        const fetchTreatments = async () => {
            try {
                const data = await getTreatments(doctorId);
                setNumberOfTreatments(data.totalElements);
                console.log(data.length)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTreatments();
    }, []);

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

    const today = new Date();

    const activeTreatments = numberOfTreatments;

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
                        <p>{activeTreatments}</p>
                    </div>

                    <div className="stat-box">
                        <h3>Average Progress</h3>
                        <p>0%</p>
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
                        <PatientDetails patient={p} handlePrescribe={handlePrescribe} />
                    </li>

                ))}
            </ul>

        </div>
    );
}

export default Dashboard;
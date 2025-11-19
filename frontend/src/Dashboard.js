import React from "react";

function PatientDetails({ patient }) {
    return (
        <div>
            <h3>{patient.name}</h3>
            <p>Tratament: {patient.treatment || "Nedefinit"}</p>
        </div>
    );
}

function Dashboard() {
    const [patients] = React.useState([
        { id: 1, name: "Ion Popescu", treatment: "Medicament A" },
        { id: 2, name: "Maria Ionescu", treatment: "Medicament B" },
        { id: 3, name: "Alex Muntean", treatment: "Medicament C" }
    ]);

    const [selectedPatient, setSelectedPatient] = React.useState(null);

    const [search, setSearch] = React.useState("");

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    function handleSelect(p) {
        if (selectedPatient?.id === p.id) {
            setSelectedPatient(null);
        } else {
            setSelectedPatient(p);
        }
    }

    function handlePatientClick(patient) {
        if (selectedPatient && selectedPatient.id === patient.id) {
            setSelectedPatient(null);
        } else {
            setSelectedPatient(patient);
        }
    }


    return (
        <div>
            <h1>Dashboard Doctor</h1>

            {/* 🔥 input search */}
            <input
                type="text"
                placeholder="Caută pacient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <ul>
                {filteredPatients.map(p => (
                    <li
                        key={p.id}
                        onClick={() => handleSelect(p)}
                        style={{
                            cursor: "pointer",
                            fontWeight: selectedPatient?.id === p.id ? "bold" : "normal",
                            textDecoration: selectedPatient?.id === p.id ? "underline" : "none",
                            color: selectedPatient?.id === p.id ? "blue" : "black"
                        }}
                    >
                        {p.name}
                    </li>
                ))}
            </ul>

            {selectedPatient && (
                <PatientDetails patient={selectedPatient}/>
            )}
        </div>
    );
}

export default Dashboard;

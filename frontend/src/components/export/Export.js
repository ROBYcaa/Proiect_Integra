import React, { useEffect, useState } from "react";
import { getPatients, createExport } from "../../api/api";
import "./Export.css";

const Export = () => {
    const [patients, setPatients] = useState([]);
    const [patientId, setPatientId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        getPatients().then((data) => setPatients(data));
    }, []);

    const handleExport = () => {
        createExport({ patientId, startDate, endDate }).then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download"
                ,
                "prescriptions.pdf");
            link.click();
        });
    };

    return (
        <div className="export-container">
            <h2>Export Prescriptions</h2>

            <label>Patient</label>
            <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
            >
                <option value="">Select a patient</option>
                {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName}
                    </option>
                ))}
            </select>

            <label>Start Date</label>
            <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
            />

            <label>End Date</label>
            <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />

            <button onClick={handleExport}>EXPORT PDF</button>
        </div>
    );
};

export default Export;

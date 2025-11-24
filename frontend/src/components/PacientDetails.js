import React, { useEffect, useState } from "react";
import { getPatientDetails } from "../api/api";

function PatientDetails({ patient }) {
    const [details, setDetails] = useState(null);

    useEffect(() => {
        const loadDetails = async () => {
            try {
                const data = await getPatientDetails(patient.id);
                setDetails(data);
            } catch (err) {
                console.error(err);
            }
        };

        loadDetails();
    }, [patient]);

    if (!details) return <p>Se încarcă detaliile...</p>;

    return (
        <div style={{ border: "1px solid #ddd", padding: "10px", marginTop: "10px" }}>
            <h3>{details.firstName} {details.lastName}</h3>
            <p>Vârsta: {details.age}</p>
            <p>Înălțime: {details.height} cm</p>
            <p>Greutate: {details.weight} kg</p>
            <p>Sex: {details.sex}</p>
            <p>Info suplimentare: {details.extraInfo}</p>
        </div>
    );
}

export default PatientDetails;

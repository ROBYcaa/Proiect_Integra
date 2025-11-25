import React, { useEffect, useState } from "react";
import {getPatients} from "../../api/api";
import {FormControl, InputLabel, Select, MenuItem, TextField, Button,} from "@mui/material";
import "./PrescriptionForm.css";

function PrescriptionForm() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const[form, setForm] = useState({
        doctorID: localStorage.getItem("email") || "",
        patientID: '',
        medication: '',
        dosage: '',
        frequency: '',
        notes: '',
    });


    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);


    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Prescription data:", form);
        alert("Prescription submitted!");
        setForm({
            doctorID: localStorage.getItem("email") || "",
            patientID: "",
            medication: "",
            dosage: "",
            frequency: "",
            notes: "",
        });
    };


    if (loading) return <p>Se încarcă pacienții...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;


    return (
        <div className="prescription_form">
            <h1>Introduce Prescription</h1>

            <form onSubmit={handleSubmit} className="prescription-details" style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "400px" }}>
                {/* Patient Select */}
                <FormControl fullWidth required>
                    <InputLabel id="patient-label">Patient</InputLabel>
                    <Select
                        labelId="patient-label"
                        name="patientID"
                        value={form.patientID}
                        label="Patient"
                        onChange={handleChange}
                    >
                        {patients.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                                {p.lastName} {p.firstName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Medication */}
                <TextField
                    label="Medication"
                    name="medication"
                    value={form.medication}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                {/* Dosage */}
                <TextField
                    label="Dosage"
                    name="dosage"
                    value={form.dosage}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                {/* Frequency */}
                <TextField
                    label="Frequency (per day)"
                    name="frequency"
                    type="number"
                    value={form.frequency}
                    onChange={handleChange}
                    required
                    fullWidth
                    inputProps={
                        { min: 1,
                            max:5,}
                    }
                />

                {/* Notes */}
                <TextField
                    label="Notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />

                <Button variant="contained" color="primary" type="submit">
                    Submit Prescription
                </Button>
            </form>
        </div>
    );
}

export default PrescriptionForm;
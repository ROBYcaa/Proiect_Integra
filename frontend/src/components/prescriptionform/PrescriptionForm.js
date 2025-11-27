import React, { useEffect, useState } from 'react';
import { getPatients,postTreatment } from "../../api/api";
import {
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    TextareaAutosize
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import './PrescriptionForm.css';

export default function PrescriptionForm() {
    const query = new URLSearchParams(useLocation().search);
    const preselectedPatientId = query.get('patientId');
    const currentUserId = localStorage.getItem("currentUserId");

    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({
        doctorId: '',
        patientId: '',
        medicationName: '',
        dosage: '',
        timesPerDay: '',
        notes: ''
    });

    // Fetch patient list from backend
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await getPatients();
                setPatients(data);
            } catch (err) {
//            setError(err.message);
            } finally {
//            setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    useEffect(() => {
        console.log(preselectedPatientId);
        if (preselectedPatientId) {
            setForm(prev => ({ ...prev, patientId: preselectedPatientId }));
        }
    }, [preselectedPatientId]);

    useEffect(() => {
        setForm(prev => ({ ...prev, doctorId: currentUserId }));
    }, [currentUserId])

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Prescription submitted:", form);
        try {
            const body = { ...form, frequency: Number(form.frequency) };
            const result = await postTreatment(body);
            console.log("Treatment added:", result);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form className="treatment-form" onSubmit={handleSubmit}>
            <h2>Introduce Prescription</h2>

            {/* Patient select */}
            <FormControl fullWidth margin="normal">
                <InputLabel id="patient-label">Select Patient</InputLabel>
                <Select
                    labelId="patient-label"
                    name="patientId"
                    value={form.patientId}
                    onChange={handleChange}
                    label="Select Patient"
                >
                    {patients.map(p => (
                        <MenuItem key={p.id} value={p.id}>
                            {p.firstName} {p.lastName}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                name="medicationName"
                label="Treatment Name"
                variant="outlined"
                margin="normal"
                value={form.medicationName}
                onChange={handleChange}
            />

            {/* Dosage */}
            <TextField
                label="Dosage"
                name="dosage"
                value={form.dosage}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
            />

            {/* Frequency */}
            <TextField
                label="Frequency (per day)"
                name="timesPerDay"
                type="number"
                value={form.timesPerDay}
                onChange={handleChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: 3 }} // restrict value between 1 and 3
                required
            />

            {/*   Start Date
//      <TextField
//        label="Start Date"
//        type="date"
//        name="startDate"
//        value={form.startDate}
//        onChange={handleChange}
//        fullWidth
//        margin="normal"
//        InputLabelProps={{ shrink: true }}
//      />
*/}
            {/* Notes */}
            <FormControl fullWidth margin="normal">
                <TextareaAutosize
                    minRows={3}
                    placeholder="Notes"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '8px', borderColor: '#ccc' }}
                />
            </FormControl>

            {/* Submit button */}
            <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
                sx={{ mt: 2 }}
            >
                Save
            </Button>
        </form>
    );
}
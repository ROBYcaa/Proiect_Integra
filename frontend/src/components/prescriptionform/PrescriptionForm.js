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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ro } from 'date-fns/locale';

export default function PrescriptionForm() {
    const query = new URLSearchParams(useLocation().search);
    const preselectedPatientId = query.get('patientId');
    const currentUserId = localStorage.getItem("currentUserId");
    const [successMessage, setSuccessMessage] = useState("");


    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({
        doctorId: '',
        patientId: '',
        medicationName: '',
        dosage: '',
        timesPerDay: '',
        notes: '',
        startDate:'',
        endDate:''
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

            setSuccessMessage("Prescription saved successfully");

            setForm({
                doctorId: currentUserId,
                patientId: preselectedPatientId || "",
                medicationName: "",
                dosage: "",
                timesPerDay: "",
                notes: "",
                startDate: "",
                endDate: ""
            });

            setTimeout(() => setSuccessMessage(""), 3000);
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
                inputProps={{ min: 1, max: 3 }}
                required
            />

            {/* Start / End Dates */}
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ro}>
                <FormControl fullWidth margin="normal">
                    <DatePicker
                        label="Start Date"
                        value={form.startDate ? new Date(form.startDate) : null}
                        onChange={(value) => {
                            setForm(prev => ({
                                ...prev,
                                startDate: value ? value.toISOString() : ""
                            }));
                        }}
                        format="dd/MM/yyyy"
                    />
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <DatePicker
                        label="End Date"
                        value={form.endDate ? new Date(form.endDate) : null}
                        minDate={form.startDate ? new Date(form.startDate) : null}
                        onChange={(value) => {
                            setForm(prev => ({
                                ...prev,
                                endDate: value ? value.toISOString() : ""
                            }));
                        }}
                        format="dd/MM/yyyy"
                    />
                </FormControl>
            </LocalizationProvider>

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
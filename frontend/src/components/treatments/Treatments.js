import React, { useEffect, useState } from "react";
import {deleteTreatment, getTreatments, updateTreatment} from "../../api/api";
import {
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle, FormControl,
    TextField,
    Typography
} from "@mui/material";
import Button from "@mui/material/Button";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {ro} from "date-fns/locale";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";

export default function Treatments() {
    const [treatments, setTreatments] = useState([]);
    const doctorId = localStorage.getItem("currentUserId");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editOpen, setEditOpen] = useState(false);
    const [selectedTreatment, setSelectedTreatment] = useState(null);

    const formatDate = (isoString) => {
        if (!isoString) return "—";
        return new Date(isoString).toLocaleDateString("ro-RO");
    };

    const handleDelete = async (treatmentId) => {
        const isConfirmed = window.confirm("Are you sure?");
        if (!isConfirmed) {
            return;
        }
        await deleteTreatment(treatmentId);
        setTreatments(prevTreatments =>
            prevTreatments.filter(t => t.id !== treatmentId)
        );
    }

    const handleEdit = (treatment) => {
        setSelectedTreatment(treatment);
        setEditOpen(true);
    }

    const handleEditSave = async () => {
        try {
            await updateTreatment(selectedTreatment.id, selectedTreatment);
            setEditOpen(false);
            fetchTreatments();
        } catch (error) {
            console.error("Error updating treatment:"
                , error);
        }
    };
    const fetchTreatments = async () => {
        try {
            const data = await getTreatments(doctorId);
            setTreatments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {

        fetchTreatments();
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                My Treatments
            </Typography>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                {treatments.map(t => (
                    <Card
                        key={t.id}
                        sx={{ width: 250, boxShadow: 3 }}
                    >
                        <CardContent>
                            <Typography variant="h6">
                                {t.medicationName}
                            </Typography>

                            <Typography>
                                <strong>Patient:</strong> {t.patientFirstName} {t.patientLastName}
                            </Typography>

                            <Typography>
                                <strong>Dosage:</strong> {t.dosage}
                            </Typography>

                            <Typography>
                                <strong>Frequency per day:</strong> {t.timesPerDay}
                            </Typography>

                            <Typography>
                                <strong>Start Date:</strong> {formatDate(t.startDate)}
                            </Typography>

                            <Typography>
                                <strong>End Date:</strong> {formatDate(t.endDate)}
                            </Typography>

                            <Typography>
                                <strong>Notes:</strong> {t.notes ?? "None"}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => handleEdit(t)}
                                sx={{ mt: 1 }}
                            >
                                Edit
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleDelete(t.id)}
                                sx={{ mt: 1 }}
                            >
                                Delete
                            </Button>

                        </CardContent>
                    </Card>
                ))}
            </div>
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edit Treatment</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <TextField
                        label="Treatment Name"
                        value={selectedTreatment?.medicationName || ""}
                        onChange={(e) =>
                            setSelectedTreatment(prev => ({ ...prev, medicationName: e.target.value }))
                        }
                    />

                    <TextField
                        label="Dosage"
                        value={selectedTreatment?.dosage || ""}
                        onChange={(e) =>
                            setSelectedTreatment(prev => ({ ...prev, dosage: e.target.value }))
                        }
                    />

                    <TextField
                        label="Times per day"
                        type="number"
                        value={selectedTreatment?.timesPerDay || ""}
                        onChange={(e) =>
                            setSelectedTreatment(prev => ({ ...prev, timesPerDay: e.target.value }))
                        }
                    />

                    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ro}>
                        <FormControl fullWidth margin="normal">
                            <DatePicker
                                label="Start Date"
                                value={selectedTreatment.startDate ? new Date(selectedTreatment.startDate) : null}
                                onChange={(value) => {
                                    setSelectedTreatment(prev => ({
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
                                value={selectedTreatment.endDate ? new Date(selectedTreatment.endDate) : null}
                                minDate={selectedTreatment.startDate ? new Date(selectedTreatment.startDate) : null}
                                onChange={(value) => {
                                    setSelectedTreatment(prev => ({
                                        ...prev,
                                        endDate: value ? value.toISOString() : ""
                                    }));
                                }}
                                format="dd/MM/yyyy"
                            />
                        </FormControl>
                    </LocalizationProvider>

                    <TextField
                        label="Notes"
                        value={selectedTreatment?.notes || ""}
                        onChange={(e) =>
                            setSelectedTreatment(prev => ({ ...prev, notes: e.target.value }))
                        }
                    />

                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleEditSave}>Save</Button>
                </DialogActions>
            </Dialog>

        </div>

    );

};

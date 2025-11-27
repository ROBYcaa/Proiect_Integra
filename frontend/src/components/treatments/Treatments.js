import { useEffect, useState } from "react";
import { getTreatments } from "../../api/api";
import { Card, CardContent, Typography } from "@mui/material";

export default function Treatments() {
    const [treatments, setTreatments] = useState([]);
    const doctorId = localStorage.getItem("currentUserId");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const formatDate = (isoString) => {
        if (!isoString) return "—";
        const date = new Date(isoString);
        return date.toLocaleDateString("ro-RO");
    };

    useEffect(() => {
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

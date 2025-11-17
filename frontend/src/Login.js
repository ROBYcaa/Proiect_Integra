import { useState } from "react";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Email sau parolă incorectă.");
            }

            alert("Autentificare reușită!");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Autentificare</h2>

                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        className="login-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Parola"
                        className="login-input"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Se încarcă..." : "Login"}
                    </button>
                </form>

                {error && <p className="error-text">{error}</p>}
            </div>
        </div>
    );
}

export default Login;

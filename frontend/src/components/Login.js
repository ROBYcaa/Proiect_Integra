import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login({setUser}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

            const data = await response.json();
            const token = data.accessToken;
            const currentUserId = data.userId;
            const role = data.role;

            localStorage.setItem("token", token);
            localStorage.setItem("currentUserId", currentUserId);
            localStorage.setItem("role", role);
            localStorage.setItem("email", email);

            setUser({
                loggedIn: true,
                role: role,
                email: email
            });

            localStorage.setItem("token", token);
            localStorage.setItem("currentUserId", currentUserId);

            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div style={{ width: "300px", margin: "auto" }}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Parola"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Se încarcă..." : "Login"}
                </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default Login;
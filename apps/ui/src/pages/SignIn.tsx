import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import BasePage from "./BasePage";
import { authService } from "../services/auth-service";

function SignInForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await authService.login(formData);
            navigate("/home");
        } catch (error: any) {
            console.error("Register error:", error);
            setError(error.message || "Error al crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full mt-5 flex-col justify-center items-center bg-transparent">
            <div className="w-1/3">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="block w-full rounded-full bg-white px-10 py-3
                            text-base text-accent font-geist
                            border-0
                            placeholder:text-accent
                            focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="block w-full rounded-full bg-white px-10 py-3
                            text-base text-accent font-geist
                            border-0
                            placeholder:text-accent
                            focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm text-center">
                        {error}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 rounded-full px-4 py-2 font-semibold font-geist
                            bg-accent hover:bg-accent text-white transition">
                            {loading ? "Iniciando..." : "Iniciar"}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm font-geist text-accent">
                    ¿No tenés cuenta?{' '}
                    <Link to="/signup" className="font-bold font-geist text-accent hover:text-accent">
                        ¡Registrate!
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function SignIn() {
    return (
        <BasePage pageName="login">
            <div className="flex flex-col items-center justify-center bg-dominant w-full font-geist">
            <h1 className="text-4xl font-bold text-accent">Inicia Sesion</h1>
            <h2 className="mt-1 w-1/2 text-xl text-center text-accent/60">Hace tu cuenta para poder acceder a los mejores eventos!!</h2>
            <SignInForm />
            </div>
        </BasePage>
    );
}

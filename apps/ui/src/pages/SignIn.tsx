import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Home } from "lucide-react";

interface LoginResponse {
  ok: boolean;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
  mensaje?: string;
}

function LoginForm() {
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
            const response = await fetch("http://localhost:8000/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

        const data: LoginResponse = await response.json();

        if (response.ok && data.ok && data.data) {
            localStorage.setItem("accessToken", data.data.accessToken);
            localStorage.setItem("refreshToken", data.data.refreshToken);
            
            navigate("/home");
        } else {
            setError(data.mensaje || "Error al iniciar sesión");
        }
        } catch (error) {
            console.error("Login error:", error);
            setError("Error de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex w-full mt-20 flex-col justify-center items-center bg-transparent">
            <div className="flex flex-col justify-center items-center w-1/3">
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
                            bg-accent hover:bg-darkcolor text-white transition">
                            {loading ? "Iniciando..." : "Iniciar"}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-sm font-geist text-accent">
                    ¿No tenés cuenta?{' '}
                    <Link to="/signup" className="font-bold font-geist text-accent hover:text-darkcolor">
                        ¡Registrate!
                    </Link>
                </p>

                <Link to="/home" className="text-accent mt-5">
                    <Home size={40}/>
                </Link>
            </div>
        </div>
    );
}

export default function LogIn() {
    return (
        <div className="flex flex-col items-center justify-center bg-dominant h-screen w-full font-geist">
          <h1 className="text-5xl font-bold text-darkcolor">Inicia Sesion</h1>
          <h2 className="mt-7 w-1/2 text-2xl text-center text-darkcolor/60">Hace tu cuenta para poder acceder a los mejores eventos!!</h2>
          <LoginForm />
        </div>
    );
}

import { LogOut, Menu, UserRoundIcon, X } from "lucide-react";
import { useState, useEffect} from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isOptionSignOutOpen, setIsOptionSignOutOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const hideButtons = location.pathname === "/signin" || location.pathname === "/signup";

    useEffect(() => {
        checkAuth();
    }, []);


    const checkAuth = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            setIsAuthenticated(payload.exe > currentTime);
        } catch (error) {
            setIsAuthenticated(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        setIsAuthenticated(false);
        setIsOptionSignOutOpen(false);
        setIsOptionsOpen(false);
        navigate("/signup");
    };

    return (
      <div className="flex items-center justify-center bg-secondary w-full h-[70px] border-b border-gray-300">
        <div className="relative flex items-center justify-between w-[90%]">
          <div className="flex justify-center text-center items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex justify-center items-center">
              <Menu className="text-accent h-7 w-7"/>
            </button>
            {isMenuOpen && (
            <div className="absolute top-full left-0 px-4 broder border-accent mt-2 w-48 bg-white rounded-2xl shadow-sm flex flex-col text-start z-30 origin-top">
                <Link
                    to={"/events"}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-row py-2 mt-1 text-accent hover:text-hovercolor text-lg transition-transform hover:scale-105 ml-3 origin-left z-50">
                    <p>Ver Eventos</p>
                </Link>
                {isAuthenticated && (
                  <Link
                      to={"/createevent"}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex flex-row py-2 mt-1 text-accent hover:text-hovercolor text-lg transition-transform hover:scale-105 ml-3 origin-left z-50">
                      <p>Crear Evento</p>
                  </Link>
                )}
            </div>
            )}
            {isMenuOpen && (
                <div
                    className="fixed inset-0 mt-28 z-10"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}>
                </div>
            )}
            <Link to="/home" className="text-black font-bold text-2xl ml-5">MiguEventos</Link>
            <div className="flex items-end w-1/2"/>
          </div>



          
          <nav className="flex gap-8 flex-1 justify-end text-sm font-semibold text-white tracking-wide items-center">
            {!hideButtons && (
              isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                    className="flex items-center justify-center border-2 h-10 w-10 border-white rounded-full hover:scale-105 transition-transform z-30">
                    <UserRoundIcon className="scale-150" strokeWidth={1.5}/>
                  </button>

                  {isOptionsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-dominant rounded-2xl shadow-lg flex flex-col text-start z-30
                                    origin-top transition-all duration-300 ease-out animate-[growDown_0.25s_ease-out]">
                      <Link
                        to={"/profile"}
                        onClick={() => setIsOptionsOpen(false)}
                        className="flex flex-row py-2 mt-1 text-accent hover:text-hovercolor text-lg transition-transform hover:scale-105 ml-3 origin-left z-50">
                        <UserRoundIcon className="mr-2"/>
                        <p>Perfil</p>
                      </Link>
                      <div className="mx-auto flex w-[90%] items-center border-t border-gray-500 rounded-full"/>
                      <button
                        onClick={() => {
                          setIsOptionSignOutOpen(!isOptionSignOutOpen);
                          setIsOptionsOpen(!isOptionsOpen);
                      }}
                      className="flex flex-row py-2 mb-1 text-red-800 hover:text-red-900 text-lg transition-transform hover:scale-105 ml-3 origin-left">
                      <LogOut className="mr-2"/>
                      <p>Cerrar Sesión</p>
                    </button>
                  </div>
                )}
                {isOptionsOpen && (
                  <div
                    className="fixed inset-0 mt-28 z-10"
                    onClick={() => setIsOptionsOpen(!isOptionsOpen)}>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center bg-accent rounded-2xl px-3 h-9
                              hover:scale-105 transition-transform origin-center">
                <Link to="/signin" className="items-end text-white font-bold text-lg">Iniciar Sesión</Link>
              </div>
            ))}
          </nav>
        </div>

        {isOptionSignOutOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-md w-[90%] relative">
              <button
                onClick={() => {setIsOptionSignOutOpen(!isOptionSignOutOpen)}}
                className="absolute top-4 right-4">
                <X size={30} className="absolute top-4 right-4 text-accent hover:hovercolor"/>
              </button>
              <h1 className="text-2xl font-bold text-accent mb-2">¿Cerrar Sesión?</h1>
              <p className="text-accent/60 mb-6">
                ¿Estas seguro que querés cerrar sesión?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={handleLogout}
                  className="flex-1 py-2 px-4 bg-red-900 text-white rounded-full hover:bg-red-800 transition disabled:opacity-50">
                  Aceptar
                </button>
                <button
                  onClick={() => {setIsOptionSignOutOpen(!isOptionSignOutOpen)}}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

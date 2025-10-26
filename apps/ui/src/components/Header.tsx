import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
      <div className="flex items-center justify-center bg-secondary w-full h-[70px] border-b border-gray-300">
        <div className="relative flex items-center justify-between w-[90%]">
          <div className="flex justify-center text-center items-center">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex justify-center items-center">
              <Menu className="text-accent h-7 w-7"/>
            </button>
            {isMenuOpen && (
            <div className="absolute top-full left-0 px-4 broder border-accent mt-2 w-48 bg-white rounded-2xl shadow-lg shadow-accent flex flex-col text-start z-30 origin-top">
                <Link
                    to={"/events"}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-row py-2 mt-1 text-accent hover:text-hovercolor text-lg transition-transform hover:scale-105 ml-3 origin-left z-50">
                    <p>Ver Eventos</p>
                </Link>
                <Link
                    to={"/createevent"}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-row py-2 mt-1 text-accent hover:text-hovercolor text-lg transition-transform hover:scale-105 ml-3 origin-left z-50">
                    <p>Crear Evento</p>
                </Link>
                <Link
                    to={"/profile"}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-row py-2 mt-1 text-accent hover:text-hovercolor text-lg transition-transform hover:scale-105 ml-3 origin-left z-50">
                    <p>Mis Eventos</p>
                </Link>
                <Link
                    to={"/profile"}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-row py-2 mt-1 text-accent hover:text-hovercolor text-lg transition-transform hover:scale-105 ml-3 origin-left z-50">
                    <p>Mis Inscripciones</p>
                </Link>
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
          <div className="flex items-center justify-center bg-accent rounded-2xl px-3 h-9
                          hover:scale-105 transition-transform origin-center">
            <Link to="/signin" className=" items-end text-white font-bold text-lg">Iniciar Sesión</Link>
          </div>
        </div>
        
      </div>
    );
}

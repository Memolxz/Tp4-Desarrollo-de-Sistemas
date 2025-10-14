import { Calendar } from "lucide-react";
import { Link } from 'react-router-dom';

export default function Header() {
    return (
      <div className="flex items-center justify-center bg-secondary w-full h-[70px] border-b border-gray-300">
        <div className="flex items-center w-[90%]">
          <div className="flex justify-center text-center items-center w-1/2">
            <div className="flex justify-center items-center bg-pink-500 h-11 w-11 rounded-2xl">
              <Calendar className="text-white h-7 w-7"/>
            </div>
            <Link to="/home" className="text-black font-bold text-2xl ml-5">MiguEventos</Link>
            <div className="flex items-end w-1/2"/>
          </div>
          <div className="flex w-1/2">
            <div className="flex w-2/3"/>
            <div className="flex items-center justify-center bg-pink-500 rounded-2xl w-1/4 h-9
                            hover:scale-105 transition-transform origin-center">
              <Link to="/profile" className=" items-end text-white font-bold text-lg">Iniciar Sesión</Link>
            </div>
          </div>
        </div>
      </div>
    );
}

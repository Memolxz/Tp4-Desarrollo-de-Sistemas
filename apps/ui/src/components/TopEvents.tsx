import { MapPin, Calendar, UsersRound, ArrowRight } from "lucide-react";
import valenImg from "../assets/valen.jpg";
import luImg from "../assets/lu.jpg";
import memoImg from "../assets/kia.jpg";
import balooImg from "../assets/baloo.jpg"

export default function TopEvents() {
  return (
    <div className="bg-transparent w-[80%] mt-20">
      <div className="w-full flex flex-row justify-center">

        <div className="w-2/3 flex flex-col justify-center items-start">
          <h1 className="text-4xl text-start font-bold text-black">Los eventos más destacados</h1>
          <p className="text-2xl text-start font-normal text-black/60 mt-2">Los eventos más populares de la temporada.</p>
        </div>

        <div className="w-1/3 flex flex-row justify-end items-center">
          <button className="w-1/2 flex flex-row justify-center items-center bg-pink-500 text-dominant h-9 rounded-2xl">
            <p className="mr-2 text-md font-semibold">Ver todos</p>
            <ArrowRight></ArrowRight>
          </button>
        </div>
      </div>
      <div className="border-t border-gray-300 my-10 w-full h-0"/>

      <div className="flex flex-row justify-center items-center w-full">
        {/* Evento1 */}
        <div className="flex flex-col justify-center items-center w-1/2 rounded-2xl border-gray-300 border m-4 bg-white">
          <img src={ valenImg } alt="valen"  className="flex flex-col justify-center items-center bg-black/65 w-full h-52 rounded-2xl"/>
          <div className="flex flex-col justify-center items-start w-full">
            <h2 className="font-semibold text-xl mt-5 ml-5">Bienvenida Valen!</h2>
            <p className="font-normal text-sm text-black/65 mt-2 mx-5">Lo mejor que le paso a este mundo despues de ser mama UwU.</p>

            <div className="flex flex-row justify-center items-center text-start mt-8 mx-5">
              <MapPin className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">Palermo, Buenos Aires</p>
            </div>

            <div className="flex flex-row justify-center items-center text-start mt-3 mx-5">
              <Calendar className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">19 marzo, 2007</p>
            </div>

            <div className="flex flex-row justify-center items-center text-start mt-3 mx-5 mb-8">
              <UsersRound className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">1250 inscriptos</p>
            </div>

            <div className="border-t border-gray-300 mt-2 w-full"></div>

            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center items-center text-start mt-1 w-[90%] mb-3">
                <h2 className="font-bold text-2xl mt-2 w-1/2 text-start text-green-700">Gratis</h2>
                <div className="w-1/4"></div>
                <button className="font-semibold text-md mt-2 w-1/4 text-center bg-pink-500 text-white rounded-2xl h-9">Ver Detalles</button>
              </div>
            </div>
          </div>
        </div>

        {/* Evento2 */}
        <div className="flex flex-col justify-center items-center w-1/2 rounded-2xl border-gray-300 border m-4 bg-white">
          <img src={ luImg } alt="lu"  className="flex flex-col justify-center items-center bg-black/65 w-full h-52 rounded-2xl"/>
          <div className="flex flex-col justify-center items-start w-full">
            <h2 className="font-semibold text-xl mt-5 ml-5">Bienvenida Lu!</h2>
            <p className="font-normal text-sm text-black/65 mt-2 mx-5">Lo mejor que le paso a este mundo despues de ser mama UwU.</p>

            <div className="flex flex-row justify-center items-center text-start mt-8 mx-5">
              <MapPin className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">Palermo, Buenos Aires</p>
            </div>

            <div className="flex flex-row justify-center items-center text-start mt-3 mx-5">
              <Calendar className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">5 enero, 2007</p>
            </div>

            <div className="flex flex-row justify-center items-center text-start mt-3 mx-5 mb-8">
              <UsersRound className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">12500 inscriptos</p>
            </div>

            <div className="border-t border-gray-300 mt-2 w-full"></div>

            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center items-center text-start mt-1 w-[90%] mb-3">
                <h2 className="font-bold text-2xl mt-2 w-1/2 text-start text-green-700">Gratis</h2>
                <div className="w-1/4"></div>
                <button className="font-semibold text-md mt-2 w-1/4 text-center bg-pink-500 text-white rounded-2xl h-9">Ver Detalles</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center w-full">

        {/* Evento3 */}
        <div className="flex flex-col justify-center items-center w-1/2 rounded-2xl border-gray-300 border m-4 bg-white">
          <img src={ memoImg } alt="memo"  className="flex flex-col justify-center items-center bg-black/65 w-full h-52 rounded-2xl"/>
          <div className="flex flex-col justify-center items-start w-full">
            <h2 className="font-semibold text-xl mt-5 ml-5">Bienvenida Memo!</h2>
            <p className="font-normal text-sm text-black/65 mt-2 mx-5">Lo mejor que le paso a este mundo despues de ser mama UwU.</p>

            <div className="flex flex-row justify-center items-center text-start mt-8 mx-5">
              <MapPin className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">CABA, Buenos Aires</p>
            </div>

            <div className="flex flex-row justify-center items-center text-start mt-3 mx-5">
              <Calendar className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">7 noviembre, 2006</p>
            </div>

            <div className="flex flex-row justify-center items-center text-start mt-3 mx-5 mb-8">
              <UsersRound className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">50 inscriptos</p>
            </div>

            <div className="border-t border-gray-300 mt-2 w-full"></div>

            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center items-center text-start mt-1 w-[90%] mb-3">
                <h2 className="font-bold text-2xl mt-2 w-1/2 text-start text-green-700">Gratis</h2>
                <div className="w-1/4"></div>
                <button className="font-semibold text-md mt-2 w-1/4 text-center bg-pink-500 text-white rounded-2xl h-9">Ver Detalles</button>
              </div>
            </div>
          </div>
        </div>

        {/* Evento4 */}
        <div className="flex flex-col justify-center items-center w-1/2 rounded-2xl border-gray-300 border m-4 bg-white">
          <img src={ balooImg } alt="baloo el mejor"  className="flex flex-col justify-center items-center bg-black/65 w-full h-52 rounded-2xl"/>
          <div className="flex flex-col justify-center items-start w-full">
            <h2 className="font-semibold text-xl mt-5 ml-5">Bienvenido Baloo!</h2>
            <p className="font-normal text-sm text-black/65 mt-2 mx-5">Lo mejor que le paso a este mundo despues de ser mama UwU.</p>

            <div className="flex flex-row justify-center items-center text-start mt-8 mx-5">
              <MapPin className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">Lanús, Buenos Aires</p>
            </div>

            <div className="flex flex-row justify-center items-center text-start mt-3 mx-5">
              <Calendar className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">22 julio, 2017</p>
            </div>

            <div className="flex flex-row justify-center items-center text-start mt-3 mx-5 mb-8">
              <UsersRound className="h-5 w-5 text-black/65" strokeWidth={1.5} />
              <p className="font-normal text-sm text-black/65 ml-1">1250000 inscriptos</p>
            </div>

            <div className="border-t border-gray-300 mt-2 w-full"></div>

            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center items-center text-start mt-1 w-[90%] mb-3">
                <h2 className="font-bold text-2xl mt-2 w-1/2 text-start text-green-700">Gratis</h2>
                <div className="w-1/4"></div>
                <button className="font-semibold text-md mt-2 w-1/4 text-center bg-pink-500 text-white rounded-2xl h-9">Ver Detalles</button>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
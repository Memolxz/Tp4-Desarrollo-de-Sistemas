import { Music, Heart, BriefcaseBusiness, PartyPopper, GraduationCap, UsersRound } from "lucide-react"
export default function Categories() {
  return (
    <div className="bg-transparent w-[80%] mt-20 mb-8">
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl text-center font-bold text-black">Explorar por Categoría</h1>
          <p className="text-2xl text-center font-normal text-black/60 mt-2">Encontrá el evento que más te guste.</p>
        </div>

      <div className="bg-transparent w-full flex flex-col justify-center items-center mt-10">
        <div className="bg-transparent w-full flex flex-row justify-center items-center">
          <div className="w-1/3 h-28 border-gray-300 border rounded-2xl flex justify-center items-center m-4
                          hover:border-red-500 hover:scale-105 transition-transform bg-white">
            <div className="w-12 h-12 bg-red-200 rounded-2xl flex justify-center items-center text-center">
              <PartyPopper className="w-8 h-8 text-red-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-lg ml-5">Festivales</h2>
              <p className="font-normal text-sm text-black/65 mx-5">32 eventos disponibles.</p>
            </div>
          </div>

          <div className="w-1/3 h-28 border-gray-300 border rounded-2xl flex justify-center items-center m-4
                          hover:border-orange-500 hover:scale-105 transition-transform bg-white">
            <div className="w-12 h-12 bg-orange-200 rounded-2xl flex justify-center items-center text-center">
              <Music className="w-8 h-8 text-orange-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-lg ml-5">Recitales</h2>
              <p className="font-normal text-sm text-black/65 mx-5">49 eventos disponibles.</p>
            </div>
          </div>

          <div className="w-1/3 h-28 border-gray-300 border rounded-2xl flex justify-center items-center m-4
                          hover:border-green-500 hover:scale-105 transition-transform bg-white">
            <div className="w-12 h-12 bg-green-200 rounded-2xl flex justify-center items-center text-center">
              <GraduationCap className="w-8 h-8 text-green-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-lg ml-5">Talleres</h2>
              <p className="font-normal text-sm text-black/65 mx-5">27 eventos disponibles.</p>
            </div>
          </div>
        </div>

        <div className="bg-transparent w-full flex flex-row justify-center items-center">
          <div className="w-1/3 h-28 border-gray-300 border rounded-2xl flex justify-center items-center m-4
                          hover:border-violet-500 hover:scale-105 transition-transform bg-white">
            <div className="w-12 h-12 bg-violet-200 rounded-2xl flex justify-center items-center text-center">
              <BriefcaseBusiness className="w-8 h-8 text-violet-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-lg ml-5">Corporativos</h2>
              <p className="font-normal text-sm text-black/65 mx-5">50 eventos disponibles.</p>
            </div>
          </div>

          <div className="w-1/3 h-28 border-gray-300 border rounded-2xl flex justify-center items-center m-4
                          hover:border-pink-500 hover:scale-105 transition-transform bg-white">
            <div className="w-12 h-12 bg-pink-200 rounded-2xl flex justify-center items-center text-center">
              <Heart className="w-8 h-8 text-pink-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-lg ml-5">Casamientos</h2>
              <p className="font-normal text-sm text-black/65 mx-5">45 eventos disponibles.</p>
            </div>
          </div>

          <div className="w-1/3 h-28 border-gray-300 border rounded-2xl flex justify-center items-center m-4
                          hover:border-blue-500 hover:scale-105 transition-transform bg-white">
            <div className="w-12 h-12 bg-blue-200 rounded-2xl flex justify-center items-center text-center">
              <UsersRound className="w-8 h-8 text-blue-600"/>
            </div>
            <div>
              <h2 className="font-semibold text-lg ml-5">Reuniones</h2>
              <p className="font-normal text-sm text-black/65 mx-5">87 eventos disponibles.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
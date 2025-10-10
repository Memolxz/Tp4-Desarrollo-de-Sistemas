import { PartyPopper, Calendar, CreditCard, Search } from "lucide-react"
export default function HowItWorks() {
  return (
    <div className="bg-transparent w-[80%] mt-28">
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl text-center font-bold text-black">Cómo Funciona?</h1>
          <p className="text-2xl text-center font-normal text-black/60 mt-2">Aprendé cómo funciona nuestra página.</p>
        </div>

      <div className="bg-transparent w-full flex flex-col justify-center items-center mt-10">
        <div className="bg-transparent w-full flex flex-row justify-center items-center">
          <div className="relative w-1/3 h-60 border border-pink-200 rounded-2xl flex flex-col justify-center items-center m-4 bg-white">
            {/* Círculo con el número */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex justify-center items-center text-center rounded-full h-9 w-9 bg-pink-500 text-white text-md font-bold">
                01
              </div>
            </div>

            <div className="w-16 h-16 bg-pink-200 rounded-full flex justify-center items-center text-center mt-10">
              <Search className="w-8 h-8 text-pink-500" />
            </div>
            <div className="flex flex-col justify-center items-center text-center m-5">
              <h2 className="font-semibold text-lg">Explora Eventos</h2>
              <p className="font-normal text-sm text-black/65">
                Busca entre cientos de eventos por categoría, ubicación o fecha.
              </p>
            </div>
          </div>


          <div className="relative w-1/3 h-60 border border-pink-200 rounded-2xl flex flex-col justify-center items-center m-4 bg-white">
            {/* Círculo con el número */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex justify-center items-center text-center rounded-full h-9 w-9 bg-pink-500 text-white text-md font-bold">
                02
              </div>
            </div>

            <div className="w-16 h-16 bg-pink-200 rounded-full flex justify-center items-center text-center mt-10">
              <Calendar className="w-8 h-8 text-pink-500" />
            </div>
            <div className="flex flex-col justify-center items-center text-center m-5">
              <h2 className="font-semibold text-lg">Inscribite</h2>
              <p className="font-normal text-sm text-black/65">
                Regístrate en los eventos que te interesan con un solo click.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-transparent w-full flex flex-row justify-center items-center">
          
          <div className="relative w-1/3 h-60 border border-pink-200 rounded-2xl flex flex-col justify-center items-center m-4 bg-white">
            {/* Círculo con el número */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex justify-center items-center text-center rounded-full h-9 w-9 bg-pink-500 text-white text-md font-bold">
                03
              </div>
            </div>

            <div className="w-16 h-16 bg-pink-200 rounded-full flex justify-center items-center text-center mt-10">
              <CreditCard className="w-8 h-8 text-pink-500" />
            </div>
            <div className="flex flex-col justify-center items-center text-center m-5">
              <h2 className="font-semibold text-lg">Gestiona tu Saldo</h2>
              <p className="font-normal text-sm text-black/65">
                Carga saldo y paga eventos de forma segura y rápida.
              </p>
            </div>
          </div>

          <div className="relative w-1/3 h-60 border border-pink-200 rounded-2xl flex flex-col justify-center items-center m-4 bg-white">
            {/* Círculo con el número */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="flex justify-center items-center text-center rounded-full h-9 w-9 bg-pink-500 text-white text-md font-bold">
                04
              </div>
            </div>

            <div className="w-16 h-16 bg-pink-200 rounded-full flex justify-center items-center text-center mt-10">
              <PartyPopper className="w-8 h-8 text-pink-500" />
            </div>
            <div className="flex flex-col justify-center items-center text-center m-5">
              <h2 className="font-semibold text-lg">Disfruta</h2>
              <p className="font-normal text-sm text-black/65">
                Recibe tu confirmación y prepárate para vivir una experiencia única.
              </p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}
import { Plus } from "lucide-react";
import BasePage from "./BasePage.tsx";
import VirtualWallet from "../components/VirtualWallet.tsx";

export default function Profile() {
    return (
      <BasePage pageName={'profile'}>
        <div className="flex flex-col justify-center items-center bg-dominant h-full w-full">
          <div className="flex flex-row justify-center items-end bg-transparent w-[80%]">
            <div className="flex flex-col justify-start items-start bg-transparent w-2/3">
              <h1 className="mt-20 text-4xl font-bold text-start text-black">Mi Perfil</h1>
              <h2 className="mt-2 w-1/2 text-xl text-start text-black/60">Manejá tus datos y saldo.</h2>
            </div>

            <div className="flex flex-row justify-end items-end bg-transparent w-1/3 h-full mb-4">
              <button className="flex flex-row justify-center items-center bg-pink-500 rounded-2xl h-10 w-48 text-white text-lg font-semibold">
                <Plus className="h-6 w-6 mr-2"/>
                <p>Crear Evento</p>
              </button>
            </div>
          </div>
          <div className="w-[80%] border-b border-gray-300 h-0 my-5 z-10"/>
          <VirtualWallet />
        </div>
      </BasePage>
    );
}



import {
  SquareArrowOutUpRight,
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BasePage from "./BasePage";

export default function Payment() {

  return (
    
    <BasePage pageName="event">
    <div className="flex flex-col justify-center font-geist items-center bg-dominant w-full px-10">
      <div className="relative flex flex-row justify-between items-between bg-accent/10 w-[90%] rounded-3xl border border-accent/10">
        {/* Imagen */}
        <div className="flex flex-col justify-center items-center bg-white w-1/2 rounded-3xl relative">
          <Link to="/events">
            <ChevronLeft className="absolute top-5 left-5 text-accent h-10 w-10 z-10" />
          </Link>

          <div className="flex justify-center items-center w-full">
            
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col items-start bg-transparent w-1/2 p-10">
          <h1 className="text-start font-bold text-accent text-3xl">
            Pagar 
          </h1>
          <p className="text-start text-accent font-normal text-md mr-10 mt-5 mb-5">
            Tu Saldo: $ 1.000.000
          </p>
          <p className="text-start text-accent font-normal text-md mt-5">
            <strong>Ubicación: </strong>
            Precio del Evento: $ 2.000.000
          </p>

          <button
            className="flex flex-row justify-center items-center bg-accent rounded-2xl hover:bg-darkcolor font-semibold w-full h-10 mt-5">
            <p className="text-white">Pagar</p>
          </button>
        </div>
      </div>
    </div>
    </BasePage>
  );
}

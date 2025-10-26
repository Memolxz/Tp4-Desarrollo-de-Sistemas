import { ChevronLeft, ChevronRight, Mail, Plus, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import BasePage from "./BasePage.tsx";
import VirtualWallet from "../components/VirtualWallet.tsx";
import { useState } from "react";

// Types
type Event = {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string | null;
  price: string | null;
  category: string;
  location: string;
  bodyPart: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  date: Date | string | null;
  isCancelled: boolean;
};

function EventsCarousel({ events }: { events: Event[] }) {
  const [index, setIndex] = useState(0);
  const visible = 4;

  const next = () => {
    if (index < events.length - visible) setIndex(index + 1);
  };

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  if (events.length === 0) return <p className="text-gray-500 text-center">No hay eventos disponibles</p>;

  return (
    <div className="relative w-full">
      {/* Left Arrow */}
      {index > 0 && (
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-accent text-white rounded-full p-2 shadow-md hover:bg-hovertext transition z-10"
        >
          <ChevronLeft size={24} strokeWidth={3} />
        </button>
      )}

      {/* Visible Container */}
      <div className="overflow-hidden w-full">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${index * (100 / visible)}%)` }}
        >
          {events.map((event) => (
            <div key={event.id} className="flex-shrink-0 w-1/4 px-2">
              <Link
                to={`/event/${event.id}`}
                className="relative flex flex-col group justify-between items-center h-96 p-6 rounded-2xl bg-complement/40 shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={event.imageUrl || "/placeholder.png"}
                  alt={event.title}
                  className="w-auto h-[60%] object-contain rounded-t-xl group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
                <p className="text-center p-2 text-sm font-semibold text-accent group-hover:text-hovertext">
                  {event.title}
                </p>
                <p className="text-sm text-accent/60">{event.category}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      {index < events.length - visible && (
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-accent text-white rounded-full p-2 shadow-md hover:bg-hovertext transition z-10"
        >
          <ChevronRight size={24} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}

export default function Profile() {
  // Eventos hardcodeados
  const events: Event[] = [
    {
      id: 1,
      title: "Clase de Yoga al Atardecer",
      shortDescription: "Una sesión relajante frente al mar.",
      fullDescription: "Conectá cuerpo y mente en una experiencia única con vista al atardecer.",
      imageUrl: "",
      price: "1500",
      category: "Bienestar",
      location: "Playa Grande, Mar del Plata",
      bodyPart: "Cuerpo completo",
      isPaid: true,
      createdAt: "2025-10-10",
      updatedAt: "2025-10-15",
      date: "2025-11-05",
      isCancelled: false,
    },
    {
      id: 2,
      title: "Workshop de Skincare Natural",
      shortDescription: "Aprendé a cuidar tu piel con productos naturales.",
      fullDescription: "Taller práctico con demostraciones en vivo y recetas caseras.",
      imageUrl: "",
      price: "2000",
      category: "Skincare",
      location: "Glow Studio, Palermo",
      bodyPart: "Rostro",
      isPaid: true,
      createdAt: "2025-10-08",
      updatedAt: "2025-10-10",
      date: "2025-11-10",
      isCancelled: false,
    },
    {
      id: 3,
      title: "Meditación Guiada Online",
      shortDescription: "Ideal para reducir el estrés diario.",
      fullDescription: "Sesión online de 30 minutos para reconectar con tu respiración.",
      imageUrl: "",
      price: "Gratis",
      category: "Mindfulness",
      location: "Online",
      bodyPart: "Mente",
      isPaid: false,
      createdAt: "2025-09-25",
      updatedAt: "2025-09-30",
      date: "2025-10-30",
      isCancelled: false,
    },
    {
      id: 4,
      title: "Taller de Maquillaje Profesional",
      shortDescription: "Descubrí técnicas modernas de maquillaje.",
      fullDescription: "Dictado por expertas con materiales incluidos.",
      imageUrl: "",
      price: "3500",
      category: "Belleza",
      location: "Glow Studio, Palermo",
      bodyPart: "Rostro",
      isPaid: true,
      createdAt: "2025-10-01",
      updatedAt: "2025-10-05",
      date: "2025-11-15",
      isCancelled: false,
    },
    {
      id: 5,
      title: "Taller de Maquillaje Profesional",
      shortDescription: "Descubrí técnicas modernas de maquillaje.",
      fullDescription: "Dictado por expertas con materiales incluidos.",
      imageUrl: "",
      price: "3500",
      category: "Belleza",
      location: "Glow Studio, Palermo",
      bodyPart: "Rostro",
      isPaid: true,
      createdAt: "2025-10-01",
      updatedAt: "2025-10-05",
      date: "2025-11-15",
      isCancelled: false,
    },
  ];

  return (
    <BasePage pageName={"profile"}>
      <div className="flex flex-col justify-center items-center bg-dominant h-full w-full pb-10">
        <div className="flex flex-row justify-center items-end bg-transparent w-[80%]">
          <div className="flex flex-col justify-start items-start bg-transparent w-2/3">
            <h1 className="mt-10 text-4xl font-bold text-start text-black">Mi Perfil</h1>
            <h2 className="mt-2 w-1/2 text-xl text-start text-black/60">Manejá tus datos y saldo.</h2>
          </div>
          <div className="flex flex-row justify-end items-end bg-transparent w-1/3 h-full mb-4">
            <button className="flex flex-row justify-center items-center bg-accent rounded-2xl h-10 w-48 text-white text-lg font-semibold">
              <Plus className="h-6 w-6 mr-2" />
              <p>Crear Evento</p>
            </button>
          </div>
        </div>
        <div className="w-[80%] border-b border-gray-300 h-0 my-5 z-10" />
        <div className="flex flex-row justify-center items-end bg-transparent w-[80%] mt-5">
          <div className='w-full flex flex-row mb-10'>
              <div className='bg-accent rounded-full h-16 w-16 text-white flex justify-center items-center mr-5'>
                  <UserRound className='h-9 w-9' strokeWidth={1.5}/>
              </div>
              <div className='flex flex-col'>
                  <h2 className="text-4xl font-bold text-accent font-geist">Nombre Completo</h2>
                  <div className='w-full flex flex-row justify-start items-center'>
                      <Mail className="h-4 w-4 text-accent/60 mr-1" />
                      <p className="text-md text-accent/60 font-geist">gmail@gmail.com</p>
                  </div>
              </div>
          </div>
        </div>
        <VirtualWallet />

        {/* Mis Eventos */}
        <div className="flex flex-row justify-center items-end bg-transparent w-[80%]">
          <div className="flex flex-col justify-start items-start bg-transparent w-full">
            <h1 className="mt-10 text-4xl font-bold text-start text-black">Mis Eventos</h1>
          </div>
        </div>
        <div className="w-[80%] border-b border-gray-300 h-0 my-5 z-10" />
        <div className="w-[80%]" >
          <EventsCarousel events={events} />
        </div>

        {/* Mis Inscripciones */}
        <div className="flex flex-row justify-center items-end bg-transparent w-[80%]">
          <div className="flex flex-col justify-start items-start bg-transparent w-full">
            <h1 className="mt-10 text-4xl font-bold text-start text-black">Mis Inscripciones</h1>
          </div>
        </div>
        <div className="w-[80%] border-b border-gray-300 h-0 my-5 z-10" />
        <div className="w-[80%]" >
          <EventsCarousel events={events} />
        </div>
      </div>
    </BasePage>
  );
}

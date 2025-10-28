import {
  ChevronLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import BasePage from "./BasePage";

type Event = {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  imageUrl: string | null;
  price: string | null;
  category: string;
  location: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  date: Date | string | null;
  isCancelled: boolean;
};

// Diccionario para traducir categorías
const categoryDisplayNames: Record<string, string> = {
  CONCERT: "Concierto",
  WORKSHOP: "Taller",
  CONFERENCE: "Conferencia",
  FESTIVAL: "Festival",
  PARTY: "Fiesta",
};

// 🔹 Datos hardcodeados para usar mientras no hay backend
const dummyEvents: Event[] = [
  {
    id: 1,
    title: "Festival de Música Electrónica",
    shortDescription: "Una noche inolvidable con DJs internacionales.",
    fullDescription:
      "Vení a disfrutar del mejor sonido, luces y energía en el festival más grande de la temporada. ¡Line-up sorpresa!",
    imageUrl:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    price: "45",
    category: "FESTIVAL",
    location: "Buenos Aires, Argentina",
    isPaid: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: "2025-11-10T21:00:00",
    isCancelled: false,
  },
  {
    id: 2,
    title: "Taller de Fotografía Urbana",
    shortDescription: "Aprendé técnicas de fotografía callejera con expertos.",
    fullDescription:
      "Este taller te enseñará a capturar la esencia de la ciudad con tu cámara o celular. Incluye práctica guiada.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    price: "0",
    category: "WORKSHOP",
    location: "Córdoba, Argentina",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: "2025-11-15T15:00:00",
    isCancelled: false,
  },
];

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`http://localhost:8000/events/${id}`);

      if (!response.ok) {
        console.warn("Backend vacío o error, usando dummy data...");
        // si falla el fetch, usar evento hardcodeado
        const fallbackEvent = dummyEvents.find(
          (ev) => ev.id === parseInt(id!)
        );
        if (!fallbackEvent) throw new Error("Evento no encontrado");
        setEvent(fallbackEvent);
        return;
      }

      const json = await response.json();
      setEvent(json.data);
    } catch (err) {
      console.error("Error fetching event:", err);
      setError("Error al cargar el evento");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BasePage pageName="event loading">
      <div className="min-h-screen flex items-center justify-center bg-dominant">
        <div className="text-center">
          <div className="text-xl font-semibold text-accent mb-4">
            Cargando evento...
          </div>
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
      </BasePage>
    );
  }

  if (error || !event) {
    return (
      <BasePage pageName="event error">
      <div className="flex items-center justify-center bg-dominant">
        <div className="text-center">
          <div className="text-xl font-semibold text-red-800 mb-4">
            {error || "Evento no encontrado"}
          </div>
          <Link
            to="/events"
            className="px-6 py-2 bg-accent text-white rounded-full hover:bg-darkcolor transition">
            Volver a Eventos
          </Link>
        </div>
      </div>
      </BasePage>
    );
  }

  return (
    
    <BasePage pageName="event">
    <div className="flex flex-col justify-center font-geist items-center bg-dominant w-full px-10">
      <div className="relative flex flex-row justify-between items-between bg-accent/10 w-[90%] rounded-3xl border border-accent/10">
        {/* Imagen */}
        <div className="flex flex-col justify-center items-center bg-white w-1/2 rounded-3xl relative">
          <Link to="/events">
            <ChevronLeft className="absolute top-5 left-5 text-accent h-10 w-10 z-10" />
          </Link>
          <div className="absolute top-5 right-5 bg-accent/60 text-white font-semibold px-3 h-8 flex items-center rounded-2xl">
            <p>{categoryDisplayNames[event.category] || event.category}</p>
          </div>

          <div className="flex justify-center items-center w-full">
            <img
              src={event.imageUrl || "/placeholder.png"}
              alt={event.title}
              className="max-h-full max-w-full object-contain rounded-2xl"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col items-start bg-transparent w-1/2 p-10">
          <h1 className="text-start font-bold text-accent text-3xl">
            {event.title}
          </h1>
          <p className="text-start text-accent font-normal text-md mr-10 mt-5 mb-5">
            {event.shortDescription}
          </p>
          <p className="text-start text-accent font-normal text-md mt-5">
            <strong>Ubicación: </strong>
            {event.location}
          </p>
          <p className="text-start text-accent font-normal text-md mt-3">
            <strong>Fecha: </strong>
            {new Date(event.date || "").toLocaleString("es-AR", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>

          {event.isPaid && (
            <div className="flex flex-row items-center mt-3">
              <p className="text-accent font-semibold text-2xl">
                $ {parseFloat(event.price || "0").toLocaleString("es-AR")}
              </p>
              <p className="text-accent font-normal text-sm ml-1">USD</p>
            </div>
          )}
          {!event.isPaid && (
            <p className="text-accent font-semibold text-lg mt-3">
              Gratis
            </p>
          )}

          <button
            className="flex flex-row justify-center items-center bg-accent rounded-2xl hover:bg-darkcolor font-semibold w-full h-10 mt-5"
            onClick={() => alert(`Inscripción al evento "${event.title}"`)}
          >
            <p className="text-white">Inscribirse</p>
          </button>
        </div>
      </div>
    </div>
    </BasePage>
  );
}

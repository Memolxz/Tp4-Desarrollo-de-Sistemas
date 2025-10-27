import { Calendar, MapPin, UsersRound } from "lucide-react";
import { useState, useEffect } from "react";
import BasePage from "./BasePage";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface BasePageProps {
  pageName: string;
  children: ReactNode;
}

function BasePageEvents({ pageName, children }: BasePageProps) {
  return (
    <BasePage pageName={pageName}>
      <main className="flex flex-col items-start justify-center w-[90%] py-10 font-geist">
        <div className="flex flex-col items-start justify-center w-full">
          <div className="flex flex-row items-center justify-between w-full">
            <div className="flex flex-col items-start justify-start">
              <h1 className="text-4xl font-bold text-start text-accent">Eventos</h1>
              <p className="text-xl font-normal text-start text-accent/60">
                Descubre los eventos que están disponibles
              </p>
            </div>
          </div>
          <div className="border-b border-accent/60 my-5 w-full"></div>
        </div>
        {children}
      </main>
    </BasePage>
  );
}

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
  attendees: number | string | null;
  isCancelled: boolean;
};

// Datos hardcodeados
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
    category: "festival",
    location: "Buenos Aires, Argentina",
    isPaid: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: "2025-11-10T21:00:00",
    attendees: 200,
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
    category: "workshop",
    location: "Córdoba, Argentina",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: "2025-11-15T15:00:00",
    attendees: 200,
    isCancelled: false,
  },
    {
      id: 6,
      title: "Workshop de Skincare Natural",
      shortDescription: "Aprendé a cuidar tu piel con productos naturales.",
      fullDescription: "Taller práctico con demostraciones en vivo y recetas caseras.",
      imageUrl: "",
      price: "2000",
      category: "Skincare",
      location: "Glow Studio, Palermo",
      isPaid: true,
      createdAt: "2025-10-08",
      updatedAt: "2025-10-10",
      date: "2025-11-10",
      attendees: 200,
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
      isPaid: false,
      createdAt: "2025-09-25",
      updatedAt: "2025-09-30",
      date: "2025-10-30",
      attendees: 200,
      isCancelled: false,
    },
    {
      id: 4,
      title: "Taller de Maquillaje Profesional",
      shortDescription: "Descubrí técnicas modernas de maquillaje.",
      fullDescription: "Dictado por expertas con materiales incluidos.",
      imageUrl: "",
      price: "3500",
      location: "Glow Studio, Palermo",
      isPaid: true,
      createdAt: "2025-10-01",
      category: "festival",
      updatedAt: "2025-10-05",
      date: "2025-11-15",
      attendees: 200,
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
      isPaid: true,
      createdAt: "2025-10-01",
      updatedAt: "2025-10-05",
      date: "2025-11-15",
      attendees: 200,
      isCancelled: false,
    },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Simulamos fetch a la API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // Simulamos un fetch delay
        await new Promise((res) => setTimeout(res, 300));
        setEvents(dummyEvents);
        setFilteredEvents(dummyEvents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const applyFilters = () => {
    if (selectedCategories.length === 0) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((ev) => selectedCategories.includes(ev.category)));
    }
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setFilteredEvents(events);
  };

  if (loading)
    return (
      <BasePageEvents pageName="events">
        <div className="flex justify-center items-center py-20 text-accent font-semibold">
          Cargando eventos...
        </div>
      </BasePageEvents>
    );

  return (
    <BasePageEvents pageName="events">
      <div className="flex flex-col items-center w-full">

        {/* Filtros */}
        {/* <div className="flex flex-row justify-between items-center w-full mb-6">
          <h1 className="text-4xl font-bold text-accent">Eventos</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-accent hover:bg-hovercolor text-white px-4 py-2 rounded-full"
          >
            <span>Mostrar Filtros</span>
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {showFilters && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFilters(false)}>
            <div className="bg-white p-6 rounded-lg max-w-lg w-[90%]" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Categorías</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(categoryDisplayNames).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input type="checkbox" checked={selectedCategories.includes(key)} onChange={() => toggleCategory(key)} />
                    <span>{value}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-4">
                <button onClick={clearFilters} className="px-4 py-2 bg-gray-200 rounded">Limpiar</button>
                <button onClick={applyFilters} className="px-4 py-2 bg-accent text-white rounded">Aplicar</button>
              </div>
            </div>
          </div>
        )} */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full mt-6">
          {filteredEvents.map((event) => (
            <Link key={event.id}
                  to={`/event/${event.id}`} className="relative bg-accent/10 rounded-2xl shadow p-6 flex flex-col group">
              <img src={event.imageUrl || "/placeholder.png"} alt={event.title} className="h-48 w-full object-cover rounded group-hover:scale-105 transition-transform" />
              <div className="p-3">
                <h2 className="text-xl font-semibold text-black group-hover:text-hovercolor">{event.title}</h2>
                <p className="text-md min-h-10 text-black/70">{event.shortDescription}</p>
                <div className="min-h-20 mt-1 flex flex-col gap-2 items-start text-md text-black/80 my-5">
                  <div className="flex items-center gap-3">
                    <MapPin  size={16} strokeWidth={1.5} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar  size={16} strokeWidth={1.5} />
                    <span> {new Date(event.date || "").toLocaleDateString("es-AR")}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <UsersRound  size={16} strokeWidth={1.5} />
                    <span>{event.attendees}</span>
                  </div>
                </div>
                <div className="absolute top-5 right-5 flex justify-center bg-accent rounded-full px-3 py-1">
                  <p className="text-white text-md font-normal">{event.category}</p>
                </div>
                <div className="flex justify-between">
                  <span className="text-accent text-xl font-semibold">{event.isPaid ? `$${event.price}` : "Gratis"}</span>
                  <span className="bg-accent hover:bg-hovercolor text-white px-3 py-1 rounded-full text-md font-semibold">Ir al Evento</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && <div className="text-center py-10 text-accent/60">No se encontraron eventos con estos filtros</div>}
      </div>
    </BasePageEvents>
  );
}

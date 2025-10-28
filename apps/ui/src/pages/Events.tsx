import { Calendar, MapPin, SlidersHorizontal, UsersRound, X } from "lucide-react"
import BasePage from "./BasePage"
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { eventService, type Event } from "../services/event-service";

// Mapeo de categorías para mostrar
const categoryDisplayNames: Record<string, string> = {
  FESTIVAL: "Festival",
  REUNION_TEMATICA: "Reunión Temática",
  ENCUENTRO_BARRIAL: "Encuentro Barrial",
  RECITAL: "Recital",
  CUMPLEANIOS: "Cumpleaños",
  CASAMIENTO: "Casamiento",
  OTRO: "Otro",
};

// Mapeo de categorías desde la URL (formato amigable) idk wtf this is
const urlCategoryMapping: Record<string, string> = {
  "Festivales": "FESTIVAL",
  "Festival": "FESTIVAL",
  "Recital": "RECITAL",
  "Recitales": "RECITAL",
  "Cumpleanios": "CUMPLEANIOS",
  "Cumpleaños": "CUMPLEANIOS",
  "ReunionesTemáticas": "REUNION_TEMATICA",
  "Reunión Temática": "REUNION_TEMATICA",
  "Casamientos": "CASAMIENTO",
  "Casamiento": "CASAMIENTO",
  "EncuentrosBarriales": "ENCUENTRO_BARRIAL",
  "Encuentro Barrial": "ENCUENTRO_BARRIAL",
  "Otro": "OTRO",
};


export default function EventsPage() {
  const location = useLocation();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isPaid, setIsPaid] = useState<boolean | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    // Aplicar filtros de la URL cuando cambien los eventos
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
   
    if (categoryParam && events.length > 0) {
      // Convertir el parámetro de URL al formato del backend
      const backendCategory = urlCategoryMapping[categoryParam] || categoryParam;
      setSelectedCategories([backendCategory]);
      applyFiltersToEvents([backendCategory], isPaid, searchTerm, events);
    } else if (events.length > 0) {
      setFilteredEvents(events);
    }
  }, [location.search, events]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAllEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersToEvents = (
    categories: string[],
    paid: boolean | undefined,
    search: string,
    eventsToFilter: Event[] = events
  ) => {
    let filtered = [...eventsToFilter];

    // Filtrar por categoría
    if (categories.length > 0) {
      filtered = filtered.filter((ev) => categories.includes(ev.category));
    }

    // Filtrar por tipo de pago
    if (paid !== undefined) {
      filtered = filtered.filter((ev) => ev.isPaid === paid);
    }

    // Filtrar por búsqueda
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (ev) =>
          ev.title.toLowerCase().includes(searchLower) ||
          ev.shortDescription.toLowerCase().includes(searchLower) ||
          ev.location.toLowerCase().includes(searchLower)
      );
    }

    setFilteredEvents(filtered);
  };

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(newCategories);
  };

  const applyFilters = () => {
    applyFiltersToEvents(selectedCategories, isPaid, searchTerm);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setIsPaid(undefined);
    setSearchTerm("");
    setFilteredEvents(events);
  };

  if (loading) {
    return (
      <BasePage pageName="events">
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-accent font-semibold text-lg">Cargando eventos...</p>
          </div>
        </div>
      </BasePage>
    );
  }

  return (
    <BasePage pageName="events">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-accent">Eventos</h1>
            <p className="text-accent/60 mt-2">
                {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} disponible
                {filteredEvents.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-accent hover:bg-hovercolor text-white px-4 py-2 rounded-full"
          >
            <span>Mostrar Filtros</span>
            <SlidersHorizontal size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar eventos por nombre, descripción o ubicación..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              applyFiltersToEvents(selectedCategories, isPaid, e.target.value);
            }}
            className="w-full px-6 py-3 border-2 border-accent/30 rounded-full focus:border-accent focus:outline-none text-accent"
          />
        </div>

        <div className="border-b border-accent/60 my-5 w-full"></div>

        {/* Modal de filtros */}
        {showFilters && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowFilters(false)}
          >
            <div
              className="relative bg-white p-6 rounded-lg max-w-lg w-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFilters(false)}
                className="absolute top-4 right-4 text-darkblue hover:text-hovertext"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">Filtros</h2>

              {/* Categorías */}
              <h3 className="font-semibold mb-2">Categorías</h3>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {Object.entries(categoryDisplayNames).map(([key, value]) => (
                  <label key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(key)}
                      onChange={() => toggleCategory(key)}
                    />
                    <span>{value}</span>
                  </label>
                ))}
              </div>

               {/* Tipo de Evento */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-accent text-lg">Tipo de Evento</h3>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-accent/5 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      checked={isPaid === undefined}
                      onChange={() => setIsPaid(undefined)}
                      className="w-5 h-5 accent-accent cursor-pointer"
                    />
                    <span className="text-accent">Todos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-accent/5 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      checked={isPaid === false}
                      onChange={() => setIsPaid(false)}
                      className="w-5 h-5 accent-accent cursor-pointer"
                    />
                    <span className="text-accent">Gratuitos</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer hover:bg-accent/5 p-2 rounded-lg transition-colors">
                    <input
                      type="radio"
                      checked={isPaid === true}
                      onChange={() => setIsPaid(true)}
                      className="w-5 h-5 accent-accent cursor-pointer"
                    />
                    <span className="text-accent">De Pago</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Limpiar
                </button>
                <button
                  onClick={applyFilters}
                  className="flex-1 py-2 px-4 bg-accent text-white rounded hover:bg-hovercolor"
                >
                  Aplicar
                </button>
              </div>
              </div>
            </div>
        )}

        {/* Lista de eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filteredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/event/${event.id}`}
              className="relative bg-accent/10 rounded-2xl shadow p-6 flex flex-col group"
            >
              <img
                src={event.imageUrl || "/placeholder.png"}
                alt={event.title}
                className="h-48 w-full object-cover rounded group-hover:scale-105 transition-transform"
              />
              <div className="p-3">
                <h2 className="text-xl font-semibold text-black group-hover:text-hovercolor">{event.title}</h2>
                <p className="text-md min-h-10 text-black/70">{event.shortDescription}</p>
                <div className="min-h-20 mt-1 flex flex-col gap-2 items-start text-md text-black/80 my-5">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} strokeWidth={1.5} />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar size={16} strokeWidth={1.5} />
                    <span>{event.date ? new Date(event.date).toLocaleDateString("es-AR") : "-"}</span>
                  </div>
                  {event._count && (
                    <div className="flex items-center gap-2">
                      <UsersRound size={16} strokeWidth={1.5} />
                      <span>
                        {event._count.attendances} inscriptos
                      </span>
                    </div>
                  )}
                </div>
                <div className="absolute top-5 right-5 flex justify-center bg-accent rounded-full px-3 py-1">
                  <p className="text-white text-md font-normal">{categoryDisplayNames[event.category] || event.category}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-accent text-xl font-semibold">
                    {event.isPaid && event.price
                      ? `$${parseFloat(event.price.toString()).toLocaleString("es-AR")}`
                      : "Gratis"}
                  </span>
                  <span className="bg-accent hover:bg-hovercolor text-white px-3 py-1 rounded-full text-md font-semibold">
                    Ir al Evento
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-10 mb-36 text-accent/60">No se encontraron eventos con estos filtros</div>
        )}
      </div>
    </BasePage>
  );
}

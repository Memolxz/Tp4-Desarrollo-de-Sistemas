import { Calendar, MapPin, SlidersHorizontal, UsersRound, X } from "lucide-react"
import BasePage from "./BasePage"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

interface Event {
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
}

// Datos de ejemplo
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
    category: "Festival",
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
    category: "Workshop",
    location: "Córdoba, Argentina",
    isPaid: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    date: "2025-11-15T15:00:00",
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
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minDate, setMinDate] = useState<string>("");
  const [maxDate, setMaxDate] = useState<string>("");

  // Categorías disponibles para filtros
  const categoryDisplayNames: Record<string, string> = {
    Festival: "Festival",
    ReunionTematica: "Reunion Tematica",
    EncuentroBarrial: "Encuentro Barrial",
    Recital: "Recital",
    Cumpleaños: "Cumpleaños",
    Casamiento: "Casamiento",
    Otro: "Otro",
  }; 
  
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
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

  useEffect(() => {
    if (!events.length) return;

    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
      const filtered = events.filter(ev => ev.category === categoryParam);
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
      setSelectedCategories([]);
    }
  }, [location.search, events]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Filtrar por categoría
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((ev) => selectedCategories.includes(ev.category));
    }

    // Filtrar por precio
    filtered = filtered.filter((ev) => {
      const priceNum = ev.price ? parseFloat(ev.price) : 0;
      return priceNum >= minPrice && priceNum <= maxPrice;
    });

    // Filtrar por fecha
    filtered = filtered.filter((ev) => {
      if (!ev.date) return true;
      const eventDate = new Date(ev.date).getTime();
      const min = minDate ? new Date(minDate).getTime() : -Infinity;
      const max = maxDate ? new Date(maxDate).getTime() : Infinity;
      return eventDate >= min && eventDate <= max;
    });

    setFilteredEvents(filtered);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice(0);
    setMaxPrice(10000);
    setMinDate("");
    setMaxDate("");
    setFilteredEvents(events);
  };

  if (loading)
    return (
      <BasePage pageName="events">
        <div className="flex justify-center items-center py-20 text-accent font-semibold">
          Cargando eventos...
        </div>
      </BasePage>
    );

  return (
    <BasePage pageName="events">
      <div className="w-full max-w-7xl mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-accent">Eventos</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-accent hover:bg-hovercolor text-white px-4 py-2 rounded-full"
          >
            <span>Mostrar Filtros</span>
            <SlidersHorizontal size={20} />
          </button>
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

              {/* Precio */}
              <h3 className="font-semibold mb-2">Precio</h3>
              <div className="flex flex-col mb-4">
                <input
                  type="range"
                  min={0}
                  max={10000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-auto accent-accent"
                />
                <div className="flex flex-row justify-between">
                  <div className="flex justify-end mt-1 text-sm text-gray-700">
                    $0
                  </div>
                  <div className="flex justify-end mt-1 text-sm text-gray-700">
                    ${maxPrice}
                  </div>
                </div>
              </div>


              {/* Fecha */}
              <h3 className="font-semibold mb-2">Fecha</h3>
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-36"
                  value={minDate}
                  onChange={(e) => setMinDate(e.target.value)}
                />
                <input
                  type="date"
                  className="border rounded px-2 py-1 w-36"
                  value={maxDate}
                  onChange={(e) => setMaxDate(e.target.value)}
                />
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
                  <div className="flex items-center gap-3">
                    <UsersRound size={16} strokeWidth={1.5} />
                    <span>{event.attendees}</span>
                  </div>
                </div>
                <div className="absolute top-5 right-5 flex justify-center bg-accent rounded-full px-3 py-1">
                  <p className="text-white text-md font-normal">{event.category}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-accent text-xl font-semibold">{event.isPaid ? `$${event.price}` : "Gratis"}</span>
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

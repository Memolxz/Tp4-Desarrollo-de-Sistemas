import { ChevronLeft, Calendar, MapPin, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BasePage from "./BasePage";
import { eventService, type Event } from "../services/event-service";
import { attendanceService, purchaseService } from "../services/attendance-service";
import { authService } from "../services/auth-service";

// Mapeo de categorías
const categoryDisplayNames: Record<string, string> = {
  FESTIVAL: "Festival",
  REUNION_TEMATICA: "Reunión Temática",
  ENCUENTRO_BARRIAL: "Encuentro Barrial",
  RECITAL: "Recital",
  CUMPLEANIOS: "Cumpleaños",
  CASAMIENTO: "Casamiento",
  OTRO: "Otro",
};

export default function Event() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authService.isAuthenticated());
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(parseInt(id!));
      setEvent(data);
    } catch (err) {
      const error = err as {response?: {data?: {error: string}}};
      setError(error.response?.data?.error || "Error al cargar el evento");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendance = async () => {
    if (!event || !isAuthenticated) return;

    try {
      setActionLoading(true);
      setError("");

      if (event.isPaid) {
        // Si es pago, redirigir a página de pago
        navigate(`/payment/${event.id}`);
      } else {
        // Si es gratis, confirmar asistencia
        await attendanceService.confirmAttendance(event.id);
        alert("¡Asistencia confirmada exitosamente!");
        fetchEvent(); // Refresh event data
      }
    } catch (err) {
      const error = err as {response?: {data?: {error: string}}};
      setError(error.response?.data?.error || "Error al procesar la inscripción");
    } finally {
      setActionLoading(false);
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
        <div className="flex items-center justify-center bg-dominant min-h-screen">
          <div className="text-center">
            <div className="text-xl font-semibold text-red-800 mb-4">
              {error || "Evento no encontrado"}
            </div>
            <Link
              to="/events"
              className="px-6 py-2 bg-accent text-white rounded-full hover:bg-hovercolor transition">
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
            {event.fullDescription}
          </p>
          <p className="text-start text-accent font-normal text-md mt-5">
            <MapPin className="h-5 w-5" strokeWidth={1.5} />
            {event.location}
          </p>
          <p className="text-start text-accent font-normal text-md mt-3">
            <Calendar className="h-5 w-5" strokeWidth={1.5} />
            {new Date(event.date || "").toLocaleString("es-AR", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </p>

          {event._count && (
            <div className="flex items-center gap-3 text-accent">
              <Users className="h-5 w-5" strokeWidth={1.5} />
              <p className="text-md">
                <strong>Inscriptos:</strong>{" "}
                {event._count.attendances}
              </p>
            </div>
          )}

          {event.creator && (
            <p className="text-accent/60 text-sm text-center mt-4">
              Organizado por <strong>{event.creator.username}</strong>
            </p>
          )}

          {event.isPaid && event.price ? (
            <div className="flex items-baseline gap-2 mb-4">
              <p className="text-accent font-bold text-3xl">
                ${" "}
                {parseFloat(event.price.toString()).toLocaleString("es-AR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-accent/60 font-normal text-sm">ARS</p>
            </div>
          ) : (
            <p className="text-accent font-bold text-2xl mb-4">
              ¡Gratis!
            </p>
          )}

          {isAuthenticated ? (
            <button
              className="flex flex-row justify-center items-center bg-accent rounded-2xl hover:bg-hovercolor font-semibold w-full h-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAttendance}
              disabled={actionLoading || event.isCancelled}
            >
              <p className="text-white text-lg">
                {actionLoading
                  ? "Procesando..."
                  : event.isCancelled
                  ? "Evento Cancelado"
                  : event.isPaid
                  ? "Comprar Entradas"
                  : "Confirmar Asistencia"}
              </p>
            </button>
          ) : (
            <Link
              to="/signin"
              className="flex flex-row justify-center items-center bg-accent rounded-2xl hover:bg-hovercolor font-semibold w-full h-12 transition-colors"
            >
              <p className="text-white text-lg">
                Inicia Sesión para Inscribirte
              </p>
            </Link>
          )}
        </div>
      </div>
    </div>
    </BasePage>
  );
}

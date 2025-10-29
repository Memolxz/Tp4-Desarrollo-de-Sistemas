import { ChevronLeft, Calendar, MapPin, Users, Check } from "lucide-react";
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
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [hasPurchase, setHasPurchase] = useState(false);

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
      
      // Verificar si el usuario está inscrito
      if (authService.isAuthenticated()) {
        await checkUserRegistration(data);
      }
    } catch (err) {
      const error = err as {response?: {data?: {error: string}}};
      setError(error.response?.data?.error || "Error al cargar el evento");
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = async (eventData: Event) => {
    try {
      const eventId = eventData.id;

      if (eventData.isPaid) {
        // Para eventos pagos, verificar si tiene una compra
        const purchases = await purchaseService.getUserPurchases();
        const purchase = purchases.find(p => p.eventId === eventId);
        setHasPurchase(!!purchase);
        setIsUserRegistered(!!purchase);
      } else {
        // Para eventos gratuitos, verificar en las asistencias
        const attendances = await attendanceService.getUserAttendances();
        const attendance = attendances.find(a => a.eventId === eventId);
        setIsUserRegistered(!!attendance);
      }
    } catch (err) {
      console.error("Error checking registration:", err);
      setIsUserRegistered(false);
      setHasPurchase(false);
    }
  };

  const handleAttendance = async () => {
    if (!event || !isAuthenticated) return;

    try {
      setActionLoading(true);
      setError("");

      if (isUserRegistered && !event.isPaid && !hasPurchase) {
        // Permitir baja solo en eventos gratuitos
        await attendanceService.cancelAttendance(event.id);
        alert("Te has dado de baja del evento exitosamente.");
        setIsUserRegistered(false);
        await fetchEvent(); // Refresh event data
      } else {
        // Usuario no inscrito - proceder con inscripción
        if (event.isPaid) {
          // Si es pago, redirigir a página de pago
          navigate(`/payment/${event.id}`);
        } else {
          // Si es gratis, confirmar asistencia
          await attendanceService.confirmAttendance(event.id);
          alert("¡Asistencia confirmada exitosamente!");
          setIsUserRegistered(true);
          await fetchEvent(); // Refresh event data
        }
      }
    } catch (err) {
      const error = err as {response?: {data?: {error: string}}};
      setError(error.response?.data?.error || "Error al procesar la inscripción");
    } finally {
      setActionLoading(false);
    }
  };

  const getButtonText = () => {
    if (actionLoading) return "Procesando...";
    if (event?.isCancelled) return "Evento Cancelado";
    
    if (isUserRegistered) {
      return "Darse de Baja";
    } else {
      return event?.isPaid ? "Comprar Entradas" : "Confirmar Asistencia";
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
            <div className="absolute top-5 right-5 bg-accent/60 text-white font-semibold px-3 h-8 flex items-center rounded-2xl z-10">
              <p>{categoryDisplayNames[event.category] || event.category}</p>
            </div>

            <div className="relative w-full h-[500px] overflow-hidden rounded-2xl flex justify-center items-center bg-white">
              <img
                src={event.imageUrl || "/placeholder.png"}
                alt={event.title}
                className="w-full h-full object-cover object-center"
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

            <p className="text-start text-accent font-normal text-md mr-10 mt-5">
              {event.fullDescription}
            </p>

            {/* Lugar */}
            <div className="flex items-center gap-2 text-accent font-normal text-md mt-4">
              <MapPin className="h-5 w-5" strokeWidth={1.5} />
              <span>{event.location}</span>
            </div>

            {/* Fecha */}
            <div className="flex items-center gap-2 text-accent font-normal text-md mt-3">
              <Calendar className="h-5 w-5" strokeWidth={1.5} />
              <span>
                {new Date(event.date || "").toLocaleString("es-AR", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </span>
            </div>

            {/* Inscriptos */}
            {event._count && (
              <div className="flex items-center gap-3 text-accent mt-4">
                <Users className="h-5 w-5" strokeWidth={1.5} />
                <p className="text-md">
                  <strong>Inscriptos:</strong> {event._count.attendances}
                </p>
              </div>
            )}

            {event.creator && (
              <p className="text-accent/60 text-sm text-center mb-2 mt-4">
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
              <>
                {/* Si el usuario está inscrito en un evento pago, no mostrar botón */}
                {isUserRegistered && (event.isPaid || hasPurchase) ? (
                  <div className="flex flex-col items-center justify-center w-full h-12 bg-lightcomplement rounded-2xl border-2 border-hovercolor">
                    <Check className="h-6 w-6"/>
                    <p className="text-accent font-semibold text-lg">Ya estás inscrito</p>
                  </div>
                ) : (
                  <button
                    className={`flex flex-row justify-center items-center rounded-2xl font-semibold w-full h-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      isUserRegistered 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-accent hover:bg-hovercolor"
                    }`}
                    onClick={handleAttendance}
                    disabled={actionLoading || event.isCancelled}
                  >
                    <p className="text-white text-lg">
                      {getButtonText()}
                    </p>
                  </button>
                )}
              </>
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
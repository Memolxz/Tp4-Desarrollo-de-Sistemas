import { ChevronLeft, Calendar, MapPin, Users, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BasePage from "./BasePage";
import { eventService, type Event } from "../services/event-service";
import { attendanceService, purchaseService } from "../services/attendance-service";
import { authService } from "../services/auth-service";

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
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const init = async () => {
      const auth = authService.isAuthenticated();
      setIsAuthenticated(auth);
      if (id) await fetchEvent();
    };
    init();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEventById(Number(id));
      setEvent(data);

      // Verificar si el usuario es creador
      const currentUserId = authService.getAccessToken() ? JSON.parse(atob(authService.getAccessToken()!.split('.')[1])).id : null;
      setIsCreator(currentUserId === data.creatorId);

      // Verificar inscripción/compra
      if (authService.isAuthenticated()) await checkUserRegistration(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar el evento");
    } finally {
      setLoading(false);
    }
  };

  const checkUserRegistration = async (eventData: Event) => {
    try {
      if (eventData.isPaid) {
        const purchases = await purchaseService.getUserPurchases();
        const purchase = purchases.find((p) => p.eventId === eventData.id);
        setHasPurchase(!!purchase);
        setIsUserRegistered(!!purchase);
      } else {
        const attendances = await eventService.getUserAttendances();
        const attendance = attendances.find((a) => a.id === eventData.id);
        setIsUserRegistered(!!attendance);
      }
    } catch {
      setIsUserRegistered(false);
      setHasPurchase(false);
    }
  };

  const handleAttendance = async () => {
    if (!event || !isAuthenticated) return;
    try {
      setActionLoading(true);
      setError("");

      if (isUserRegistered && !event.isPaid) {
        await attendanceService.cancelAttendance(event.id);
        alert("Te has dado de baja del evento exitosamente.");
      } else {
        if (event.isPaid) {
          navigate(`/payment/${event.id}`);
        } else {
          await attendanceService.confirmAttendance(event.id);
          alert("¡Asistencia confirmada exitosamente!");
        }
      }
      await fetchEvent();
    } catch (err) {
      console.error(err);
      setError("Error al procesar la inscripción");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelEvent = async () => {
    if (!event) return;
    if (!window.confirm("¿Seguro que querés cancelar este evento?")) return;

    try {
      setActionLoading(true);
      await eventService.cancelEvent(event.id);
      alert("Evento cancelado exitosamente.");
      await fetchEvent();
    } catch (err) {
      console.error(err);
      alert("Error al cancelar el evento.");
    } finally {
      setActionLoading(false);
    }
  };

  const getButtonText = () => {
    if (actionLoading) return "Procesando...";
    if (event?.isCancelled) return "Evento Cancelado";
    if (isUserRegistered) return "Darse de Baja";
    return event?.isPaid ? "Comprar Entradas" : "Confirmar Asistencia";
  };

  if (loading) return <BasePage pageName="event loading"><div className="min-h-screen flex items-center justify-center text-accent font-semibold text-xl">Cargando evento...</div></BasePage>;
  if (error || !event) return <BasePage pageName="event error"><div className="min-h-screen flex items-center justify-center text-red-800 text-xl font-semibold">{error || "Evento no encontrado"}<Link to="/events" className="ml-4 px-6 py-2 bg-accent text-white rounded-full hover:bg-hovercolor transition">Volver a Eventos</Link></div></BasePage>;

  return (
    <BasePage pageName="event">
      <div className="flex flex-col justify-center items-center bg-dominant w-full px-10 font-geist">
        <div className="relative flex flex-row justify-between bg-accent/10 w-[90%] rounded-3xl border border-accent/10">
          {/* Imagen */}
          <div className="flex flex-col justify-center items-center bg-white w-1/2 rounded-3xl relative">
            <Link to="/events">
              <ChevronLeft className="absolute top-5 left-5 text-accent h-10 w-10 z-10" />
            </Link>
            <div className="absolute top-5 right-5 bg-accent/60 text-white font-semibold px-3 h-8 flex items-center rounded-2xl z-10">
              {categoryDisplayNames[event.category] || event.category}
            </div>
            <div className="relative w-full h-[500px] overflow-hidden rounded-2xl flex justify-center items-center bg-white">
              <img src={event.imageUrl || "/placeholder.png"} alt={event.title} className="w-full h-full object-cover object-center" onError={(e) => e.currentTarget.src = "/placeholder.png"} />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col items-start bg-transparent w-1/2 p-10">
            <h1 className="text-start font-bold text-accent text-3xl">{event.title}</h1>
            <p className="text-start text-accent font-normal text-md mr-10 mt-5">{event.fullDescription}</p>

            <div className="flex items-center gap-2 text-accent font-normal text-md mt-4">
              <MapPin className="h-5 w-5" strokeWidth={1.5} />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-2 text-accent font-normal text-md mt-3">
              <Calendar className="h-5 w-5" strokeWidth={1.5} />
              <span>{new Date(event.date || "").toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" })}</span>
            </div>

            {event._count && <div className="flex items-center gap-3 text-accent mt-4"><Users className="h-5 w-5" strokeWidth={1.5} /><p className="text-md"><strong>Inscriptos:</strong> {event._count.attendances}</p></div>}

            {event.creator && <p className="text-accent/60 text-sm text-center mb-2 mt-4">Organizado por <strong>{event.creator.username}</strong></p>}

            {event.isPaid && event.price ? (
              <div className="flex items-baseline gap-2 mb-4">
                <p className="text-accent font-bold text-3xl">${parseFloat(event.price.toString()).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                <p className="text-accent/60 font-normal text-sm">ARS</p>
              </div>
            ) : <p className="text-accent font-bold text-2xl mb-4">¡Gratis!</p>}

            {isAuthenticated ? (
              isCreator ? (
                <button className="flex justify-center items-center bg-red-700 hover:bg-red-800 rounded-2xl font-semibold w-full h-12 text-white transition" onClick={handleCancelEvent} disabled={event.isCancelled || actionLoading}>
                  {event.isCancelled ? "Evento Cancelado" : "Cancelar Evento"}
                </button>
              ) : isUserRegistered && (event.isPaid || hasPurchase) ? (
                <div className="flex flex-row items-center justify-center w-full h-12 bg-lightcomplement rounded-2xl border-2 border-hovercolor">
                  <Check className="h-6 w-6" />
                  <p className="text-accent font-semibold text-lg">Ya estás inscrito</p>
                </div>
              ) : (
                <button className={`flex flex-row justify-center items-center rounded-2xl font-semibold w-full h-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isUserRegistered ? "bg-red-600 hover:bg-red-700" : "bg-accent hover:bg-hovercolor"}`} onClick={handleAttendance} disabled={actionLoading || event.isCancelled}>
                  <p className="text-white text-lg">{getButtonText()}</p>
                </button>
              )
            ) : (
              <Link to="/signin" className="flex flex-row justify-center items-center bg-accent rounded-2xl hover:bg-hovercolor font-semibold w-full h-12 transition-colors">
                <p className="text-white text-lg">Inicia Sesión para Inscribirte</p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </BasePage>
  );
}

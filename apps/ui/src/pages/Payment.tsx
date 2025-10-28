import { ChevronLeft, CreditCard, Calendar, MapPin, ShoppingCart, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BasePage from "./BasePage";
import { eventService, type Event } from "../services/event-service";
import { purchaseService } from "../services/attendance-service";
import { userService } from "../services/user-service";

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [eventData, userBalance] = await Promise.all([
        eventService.getEventById(parseInt(id!)),
        userService.getBalance()
      ]);
     
      // Verificar que el evento sea pago
      if (!eventData.isPaid) {
        navigate(`/event/${id}`);
        return;
      }
     
      setEvent(eventData);
      setBalance(parseFloat(userBalance.toString()));
    } catch (err) {
      const error = err as {response?: {data?: {error: string}}};
      setError(error.response?.data?.error || "Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = event ? parseFloat(event.price?.toString() || "0") * quantity : 0;
  const hasEnoughBalance = balance >= totalAmount;

  const handlePurchase = async () => {
    if (!event || !hasEnoughBalance) return;

    try {
      setPurchasing(true);
      setError("");
      await purchaseService.purchaseTickets(event.id, quantity);
      alert(`¡Compra exitosa! ${quantity} entrada(s) adquirida(s)`);
      navigate(`/event/${event.id}`);
    } catch (err) {
      const error = err as {response?: {data?: {error: string}}};
      setError(error.response?.data?.error || "Error al realizar la compra");
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return (
      <BasePage pageName="payment loading">
        <div className="min-h-screen flex items-center justify-center bg-dominant">
          <div className="text-center">
            <div className="text-xl font-semibold text-accent mb-4">
              Cargando...
            </div>
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </BasePage>
    );
  }

  if (error && !event) {
    return (
      <BasePage pageName="payment error">
        <div className="flex items-center justify-center bg-dominant min-h-screen">
          <div className="text-center">
            <div className="text-xl font-semibold text-red-800 mb-4">
              {error}
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

  if (!event) return null;

  return (
    
    <BasePage pageName="event">
    <div className="flex flex-col justify-center font-geist items-center bg-dominant w-full px-10">
      <div className="relative flex flex-row justify-between items-between bg-accent/10 w-[90%] rounded-3xl border border-accent/10">
        {/* Imagen */}
        <div className="flex flex-col justify-center items-center bg-white w-1/2 rounded-3xl relative">
          <Link to={`/event/${event.id}`}>
            <ChevronLeft className="absolute top-5 left-5 text-accent h-10 w-10 z-10" />
          </Link>

          <div className="flex justify-center items-center w-full">
            {event.imageUrl ? (
                <img
                  src={event.imageUrl || "/placeholder.png"}
                  alt={event.title}
                  className="max-h-96 max-w-full object-contain rounded-2xl"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                  }}
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <p className="text-gray-500">Sin imagen</p>
                </div>
              )}
          </div>
        </div>

        <div className="mt-6 w-full space-y-3">
              <h2 className="text-xl font-bold text-accent">{event.title}</h2>
              <div className="flex items-center gap-2 text-accent/70 text-sm">
                <Calendar size={16} />
                <span>{new Date(event.date).toLocaleString("es-AR", { dateStyle: "long", timeStyle: "short" })}</span>
              </div>
              <div className="flex items-center gap-2 text-accent/70 text-sm">
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
            </div>
          </div>

          {/* Información de Pago */}
          <div className="flex flex-col items-start bg-transparent w-1/2 p-10 space-y-6">
            <div className="flex items-center gap-3 text-accent">
              <ShoppingCart className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Comprar Entradas</h1>
            </div>

            <div className="w-full border-t border-gray-300"></div>

            {/* Saldo Disponible */}
            <div className="w-full bg-accent/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 text-accent mb-2">
                <CreditCard className="h-5 w-5" />
                <p className="text-sm font-semibold">Tu Saldo Disponible</p>
              </div>
              <p className="text-2xl font-bold text-accent">
                $ {balance.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Cantidad de Entradas */}
            <div className="w-full">
              <label className="block text-accent font-semibold mb-2">
                Cantidad de Entradas
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-full text-accent font-bold hover:bg-gray-300 transition"
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-20 text-center px-4 py-2 border-2 border-accent/30 rounded-xl focus:border-accent focus:outline-none text-accent font-bold text-lg"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-full text-accent font-bold hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Precio por Entrada */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-accent/70">
                <span>Precio por entrada:</span>
                <span className="font-semibold">
                  $ {parseFloat(event.price?.toString() || "0").toLocaleString("es-AR")}
                </span>
              </div>
              <div className="flex justify-between text-accent/70">
                <span>Cantidad:</span>
                <span className="font-semibold">x {quantity}</span>
              </div>
            </div>

            <div className="w-full border-t border-gray-300"></div>

            {/* Total */}
            <div className="w-full">
              <div className="flex justify-between items-baseline">
                <span className="text-accent font-semibold text-lg">Total a Pagar:</span>
                <span className="text-accent font-bold text-3xl">
                  $ {totalAmount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Alerta de saldo insuficiente */}
            {!hasEnoughBalance && (
              <div className="w-full bg-red-100 border border-red-300 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-semibold text-sm">Saldo Insuficiente</p>
                  <p className="text-red-700 text-xs mt-1">
                    Te faltan $ {(totalAmount - balance).toLocaleString("es-AR", { minimumFractionDigits: 2 })} para completar esta compra.
                  </p>
                  <Link
                    to="/profile"
                    className="text-red-800 underline text-xs font-semibold hover:text-red-900 mt-2 inline-block"
                  >
                    Cargar saldo
                  </Link>
                </div>
              </div>
            )}

            {error && (
              <div className="w-full bg-red-100 border border-red-300 rounded-xl p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Botón de Compra */}
            <button
              onClick={handlePurchase}
              disabled={!hasEnoughBalance || purchasing}
              className="w-full bg-accent rounded-2xl hover:bg-hovercolor font-semibold text-white text-lg py-4 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {purchasing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </div>
              ) : (
                "Confirmar Compra"
              )}
            </button>
          </div>
        </div>
    </BasePage>
  );
}

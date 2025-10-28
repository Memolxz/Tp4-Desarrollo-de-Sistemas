import { ChevronLeft, ChevronRight, Mail, Plus, UserRound, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import BasePage from "./BasePage.tsx";
import VirtualWallet from "../components/VirtualWallet.tsx";
import { useState, useEffect } from "react";
import { eventService, type Event } from "../services/event-service";
import { userService, type User } from "../services/user-service";

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
  const [user, setUser] = useState<User | null>(null);
  const [userEvents, setUserEvents] = useState<{ Events: Event[] }>({
    Events: []
  });
  const [userAttendances, setUserAttendances] = useState<{ Attendances: Event[] }>({
    Attendances: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userData, eventsData, attendancesData] = await Promise.all([
        userService.getProfile(),
        eventService.getUserEvents(),
        eventService.getUserAttendances()
      ]);
      setUser(userData);
      setUserEvents(eventsData);
      setUserAttendances(attendancesData);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <BasePage pageName="profile">
        <div className="flex justify-center items-center min-h-screen bg-dominant">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-accent font-semibold">Cargando perfil...</p>
          </div>
        </div>
      </BasePage>
    );
  }

  if (!user) {
    return (
      <BasePage pageName="profile">
        <div className="flex justify-center items-center min-h-screen bg-dominant">
          <p className="text-red-600 font-semibold">Error al cargar el perfil</p>
        </div>
      </BasePage>
    );
  }

  return (
    <BasePage pageName={"profile"}>
      <div className="flex flex-col justify-center items-center bg-dominant h-full w-full pb-10">
        <div className="flex flex-row justify-center items-end bg-transparent w-[80%]">
          <div className="flex flex-col justify-start items-start bg-transparent w-2/3">
            <h1 className="mt-10 text-4xl font-bold text-start text-black">Mi Perfil</h1>
            <h2 className="mt-2 w-1/2 text-xl text-start text-black/60">Manejá tus datos y saldo.</h2>
          </div>
          <div className="flex flex-row justify-end items-end bg-transparent w-1/3 h-full mb-4">
            <Link to="/createevent" className="flex flex-row justify-center items-center bg-accent rounded-2xl h-10 w-48 text-white text-lg font-semibold">
              <Plus className="h-6 w-6 mr-2" />
              <p>Crear Evento</p>
            </Link>
          </div>
        </div>

        <div className="w-[80%] border-b border-gray-300 h-0 my-5 z-10" />
        <div className="flex flex-row justify-center items-end bg-transparent w-[80%] mt-5">
          <div className='w-full flex flex-row mb-10 items-center gap-5'>
              <div className='bg-accent rounded-full h-20 w-20 text-white flex justify-center items-center'>
                  <UserRound className='h-12 w-12' strokeWidth={1.5}/>
              </div>
              <div className='flex flex-col'>
                  <h2 className="text-4xl font-bold text-accent font-geist">{user.username}</h2>
                  <div className='w-full flex flex-row justify-start items-center'>
                      <Mail className="h-4 w-4 text-accent/60 mr-1" />
                      <p className="text-md text-accent/60 font-geist">{user.email}</p>
                  </div>
                  <h3 className="text-md italic text-accent/60 font-geist">DNI: {user.dni}</h3>
              </div>
          </div>
        </div>
        <VirtualWallet balance={parseFloat(user.balance.toString())} userId={user.id} onBalanceUpdate={fetchUserData} />

        {/* Mis Eventos */}
        <div className="flex flex-row justify-center items-end bg-transparent w-[80%]">
          <div className="flex flex-col justify-start items-start bg-transparent w-full">
            <h1 className="mt-10 text-4xl font-bold text-start text-black">Mis Eventos</h1>
          </div>
        </div>
        <div className="w-[80%] border-b border-gray-300 h-0 my-5 z-10" />
        <div className="w-[80%]" >
          <EventsCarousel events={userEvents.Events} />
        </div>

        {/* Mis Inscripciones */}
        <div className="flex flex-row justify-center items-end bg-transparent w-[80%]">
          <div className="flex flex-col justify-start items-start bg-transparent w-full">
            <h1 className="mt-10 text-4xl font-bold text-start text-black">Mis Inscripciones</h1>
          </div>
        </div>
        <div className="w-[80%] border-b border-gray-300 h-0 my-5 z-10" />
        <div className="w-[80%]" >
          <EventsCarousel events={userAttendances.Attendances} />
        </div>
      </div>
    </BasePage>
  );
}

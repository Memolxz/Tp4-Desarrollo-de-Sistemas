import { useState } from "react";
import { ChevronLeft, ChevronRight, MapPin, Calendar, UsersRound } from "lucide-react";
import img1 from "../assets/valen.jpg";
import img2 from "../assets/lu.jpg";
import img3 from "../assets/kia.jpg";
import img4 from "../assets/baloo.jpg";

const events = [
  {
    id: 1,
    title: "Bienvenida Valen!",
    description: "Lo mejor que le pasó a este mundo después de ser mamá UwU.",
    location: "Palermo, Buenos Aires",
    date: "19 marzo, 2007",
    attendees: "1250 inscriptos",
    price: "Gratis",
    image: img1,
  },
  {
    id: 2,
    title: "Bienvenida Lu!",
    description: "Lo mejor que le pasó a este mundo después de ser mamá UwU.",
    location: "Palermo, Buenos Aires",
    date: "5 enero, 2007",
    attendees: "12500 inscriptos",
    price: "Gratis",
    image: img2,
  },
  {
    id: 3,
    title: "Bienvenida Memo!",
    description: "Lo mejor que le pasó a este mundo después de ser mamá UwU.",
    location: "CABA, Buenos Aires",
    date: "7 noviembre, 2006",
    attendees: "50 inscriptos",
    price: "Gratis",
    image: img3,
  },
  {
    id: 4,
    title: "Bienvenido Baloo!",
    description: "Lo mejor que le pasó a este mundo después de ser mamá UwU.",
    location: "Lanús, Buenos Aires",
    date: "22 julio, 2017",
    attendees: "1250000 inscriptos",
    price: "Gratis",
    image: img4,
  },
];

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? events.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === events.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative h-screen w-full overflow-hidden mx-auto font-geist">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            className="w-full flex-shrink-0 relative"
            style={{
              backgroundImage: `url(${event.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 flex h-full justify-end items-center">
              <div className="container mx-auto px-6 md:px-20 md:pl-40">
                <div className="max-w-2xl space-y-6">
                  <h1 className="font-sans text-6xl font-bold text-white">
                    {event.title}
                  </h1>
                  <p className="text-lg text-white/90 md:text-2xl">{event.description}</p>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center gap-3 text-white/90">
                      <MapPin className="h-6 w-6" strokeWidth={1.5} />
                      <span className="text-base md:text-xl">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <Calendar className="h-6 w-6" strokeWidth={1.5} />
                      <span className="text-base md:text-xl">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/90">
                      <UsersRound className="h-6 w-6" strokeWidth={1.5} />
                      <span className="text-base md:text-xl">{event.attendees}</span>
                    </div>
                    <div className="flex items-center gap-3 text-white/80">
                      <p className="text-2xl mr-2">$</p>
                      <span className="text-base md:text-xl">{event.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

        <button
        onClick={goToPrevious}
        className="absolute left-10 top-1/2 z-20 h-12 w-12 -translate-y-1/2 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      

      <button
        onClick={goToNext}
        className="absolute right-10 top-1/2 z-20 h-12 w-12 -translate-y-1/2 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
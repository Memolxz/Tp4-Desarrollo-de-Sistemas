import { MapPin, Clock } from "lucide-react";

export default function TopEvents() {
  return (
    <div className="bg-transparent w-[80%]">
      <h1 className="mt-20 text-4xl text-center font-bold text-black">Los eventos más destacados</h1>
      <div className="flex flex-row justify-center items-center w-full mt-5">
        {/* Evento1 */}
        <div className="flex flex-col justify-center items-center w-1/2 rounded-2xl border-gray-500 border m-4">
          <div className="flex flex-col justify-center items-center bg-gray-500 w-full h-52 rounded-2xl"></div>
          <div className="flex flex-col justify-center items-start">
            <h2 className="font-semibold text-xl mt-2 ml-3">Titulo Evento</h2>
            <p className="font-semibold text-md text-gray-700 mt-2 mx-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus aliquid alias asperiores dolor animi incidunt quam? Reiciendis asperiores reprehenderit accusantium doloremque magni ad suscipit voluptate, inventore labore eligendi quaerat aliquid?</p>
            <div className="flex flex-row justify-center items-center text-start mt-3 ml-3">
              <MapPin className="h-5 w-5 text-gray-700" />
              <p className="font-semibold text-md text-gray-700 ml-1">Location</p>
            </div>
            <div className="flex flex-row justify-center items-center text-start mt-3 ml-3">
              <Clock className="h-5 w-5 text-gray-700" />
              <p className="font-semibold text-md text-gray-700 ml-1">Time</p>
            </div>
            <div className="border-t border-gray-500 mt-2 w-full"></div>
            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center items-center text-start mt-1 w-[90%] mb-3">
                <h2 className="font-bold text-2xl mt-2 w-1/2 text-start text-green-700">Gratis</h2>
                <div className="w-1/4"></div>
                <button className="font-semibold text-lg mt-2 w-1/4 text-center bg-accent text-white rounded-2xl h-9">Ver Más</button>
              </div>
            </div>
          </div>
        </div>
        {/* Evento2 */}
        <div className="flex flex-col justify-center items-center w-1/2 rounded-2xl border-gray-500 border m-4">
          <div className="flex flex-col justify-center items-center bg-gray-500 w-full h-52 rounded-2xl"></div>
          <div className="flex flex-col justify-center items-start">
            <h2 className="font-semibold text-xl mt-2 ml-3">Titulo Evento</h2>
            <p className="font-semibold text-md text-gray-700 mt-2 mx-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus aliquid alias asperiores dolor animi incidunt quam? Reiciendis asperiores reprehenderit accusantium doloremque magni ad suscipit voluptate, inventore labore eligendi quaerat aliquid?</p>
            <div className="flex flex-row justify-center items-center text-start mt-3 ml-3">
              <MapPin className="h-5 w-5 text-gray-700" />
              <p className="font-semibold text-md text-gray-700 ml-1">Location</p>
            </div>
            <div className="flex flex-row justify-center items-center text-start mt-3 ml-3">
              <Clock className="h-5 w-5 text-gray-700" />
              <p className="font-semibold text-md text-gray-700 ml-1">Time</p>
            </div>
            <div className="border-t border-gray-500 mt-2 w-full"></div>
            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center items-center text-start mt-1 w-[90%] mb-3">
                <h2 className="font-bold text-2xl mt-2 w-1/2 text-start text-green-700">Gratis</h2>
                <div className="w-1/4"></div>
                <button className="font-semibold text-lg mt-2 w-1/4 text-center bg-accent text-white rounded-2xl h-9">Ver Más</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-center items-center w-full">
        {/* Evento3 */}
        <div className="flex flex-col justify-center items-center w-1/2 rounded-2xl border-gray-500 border m-4">
          <div className="flex flex-col justify-center items-center bg-gray-500 w-full h-52 rounded-2xl"></div>
          <div className="flex flex-col justify-center items-start">
            <h2 className="font-semibold text-xl mt-2 ml-3">Titulo Evento</h2>
            <p className="font-semibold text-md text-gray-700 mt-2 mx-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus aliquid alias asperiores dolor animi incidunt quam? Reiciendis asperiores reprehenderit accusantium doloremque magni ad suscipit voluptate, inventore labore eligendi quaerat aliquid?</p>
            <div className="flex flex-row justify-center items-center text-start mt-3 ml-3">
              <MapPin className="h-5 w-5 text-gray-700" />
              <p className="font-semibold text-md text-gray-700 ml-1">Location</p>
            </div>
            <div className="flex flex-row justify-center items-center text-start mt-3 ml-3">
              <Clock className="h-5 w-5 text-gray-700" />
              <p className="font-semibold text-md text-gray-700 ml-1">Time</p>
            </div>
            <div className="border-t border-gray-500 mt-2 w-full"></div>
            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center items-center text-start mt-1 w-[90%] mb-3">
                <h2 className="font-bold text-2xl mt-2 w-1/2 text-start text-green-700">Gratis</h2>
                <div className="w-1/4"></div>
                <button className="font-semibold text-lg mt-2 w-1/4 text-center bg-accent text-white rounded-2xl h-9">Ver Más</button>
              </div>
            </div>
          </div>
        </div>
        {/* Evento4 */}
        <div className="flex flex-col justify-center items-center w-1/2 rounded-2xl border-gray-500 border m-4">
          <div className="flex flex-col justify-center items-center bg-gray-500 w-full h-52 rounded-2xl"></div>
          <div className="flex flex-col justify-center items-start">
            <h2 className="font-semibold text-xl mt-2 ml-3">Titulo Evento</h2>
            <p className="font-semibold text-md text-gray-700 mt-2 mx-3">Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus aliquid alias asperiores dolor animi incidunt quam? Reiciendis asperiores reprehenderit accusantium doloremque magni ad suscipit voluptate, inventore labore eligendi quaerat aliquid?</p>
            <div className="flex flex-row justify-center items-center text-start mt-3 ml-3">
              <MapPin className="h-5 w-5 text-gray-700" />
              <p className="font-semibold text-md text-gray-700 ml-1">Location</p>
            </div>
            <div className="flex flex-row justify-center items-center text-start mt-3 ml-3">
              <Clock className="h-5 w-5 text-gray-700" />
              <p className="font-semibold text-md text-gray-700 ml-1">Time</p>
            </div>
            <div className="border-t border-gray-500 mt-2 w-full"></div>
            <div className="flex justify-center items-center w-full">
              <div className="flex flex-row justify-center items-center text-start mt-1 w-[90%] mb-3">
                <h2 className="font-bold text-2xl mt-2 w-1/2 text-start text-green-700">Gratis</h2>
                <div className="w-1/4"></div>
                <button className="font-semibold text-lg mt-2 w-1/4 text-center bg-accent text-white rounded-2xl h-9">Ver Más</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
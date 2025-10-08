
export default function Stats() {
  return (
    <div className="bg-transparent w-[80%]">
      <h1 className="mt-20 text-4xl text-center font-bold text-black">Sobre Nosotros</h1>
      <div className="flex flex-row justify-center items-center w-full mt-5">
        <div className="flex flex-col justify-center items-center w-1/6 rounded-full border-gray-500 border m-4 p-4">
          <h1 className="font-semibold text-3xl text-start text-green-700">+75M</h1>
          <p className="font-semibold text-lg mt-1">Usuarios</p>
        </div>
        <div className="flex flex-col justify-center items-center w-1/3 rounded-full border-gray-500 border m-4 p-4">
          <h1 className="font-semibold text-3xl text-start text-green-700">+75M</h1>
          <p className="font-semibold text-lg mt-1 ml-3">Eventos</p>
        </div>
        <div className="flex flex-col justify-center items-center w-1/3 rounded-full border-gray-500 border m-4 p-4">
          <h1 className="font-semibold text-3xl text-start text-green-700">+75M</h1>
          <p className="font-semibold text-lg mt-1 ml-3">Usuarios</p>
        </div>
      </div>

    </div>
  );
}
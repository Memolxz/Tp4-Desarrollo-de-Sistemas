import { Wallet, DollarSign, CreditCard } from "lucide-react"
export default function VirtualWallet() {
  return (
    <div className="flex flex-col justify-start items-start bg-accent bg-contain w-[80%] h-56 mt-5 rounded-2xl p-5">
      <div className="flex flex-row justify-start items-start w-full">
        <div className="flex flex-row justify-start items-center text-white w-1/2">
          <Wallet className="h-7 w-7" strokeWidth={1.5}/>
          <h2 className="font-normal text-xl ml-2">Billetera Virtual</h2>
        </div>
        <div className="flex flex-row justify-end items-end text-white w-1/2">
          <CreditCard className="h-7 w-7" strokeWidth={1.5}/>
        </div>
      </div>
      <h3 className="text-white text-md text-start mt-16">Saldo Disponible</h3>
      <div className="flex flex-row justify-start items-center text-white w-1/2 mt-2">
        <h2 className="font-semibold text-2xl">$ 1.300.000,00</h2>
      </div>
    </div>
  );
}
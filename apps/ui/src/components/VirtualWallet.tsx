import { Wallet, Upload, CreditCard, X } from "lucide-react"
import { userService } from "../services/user-service";
import { useState } from "react";

interface VirtualWalletProps {
  balance: number;
  userId: number;
  onBalanceUpdate: () => void;
}

export default function VirtualWallet({ balance, userId, onBalanceUpdate }: VirtualWalletProps) {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddBalance = async () => {
    const numAmount = parseFloat(amount);
  
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Ingresá un monto válido mayor a 0");
      return;
    }

    try {
      setLoading(true);
      setError("");
      await userService.addBalance(numAmount);
      setAmount("");
      setShowModal(false);
      onBalanceUpdate(); // Refresh user data
    } catch (err) {
      const error = err as {response?: {data?: {error: string}}};
      setError(error.response?.data?.error || "Error al cargar saldo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-start items-start bg-accent bg-contain w-[80%] h-48 mt-5 rounded-2xl p-5">
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
        <div className="flex flex-row justify-between items-center text-white w-full mt-2">
          <h2 className="font-semibold text-2xl">
            $ {balance.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h2>
          <button
              onClick={() => setShowModal(true)}
              className="flex flex-row justify-center items-center bg-white rounded-2xl text-accent px-3 py-1 gap-2 hover:bg-gray-100 transition-colors"
            >
              <Upload className="h-6 w-6" />
              <p className="text-lg font-semibold">Cargar Saldo</p>
            </button>
        </div>
      </div>

      {/* Modal para cargar saldo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md w-[90%] relative">
            <button
              onClick={() => {
                setShowModal(false);
                setError("");
                setAmount("");
              }}
              className="absolute top-4 right-4 text-accent hover:text-hovercolor"
            >
              <X size={30} />
            </button>
           
            <h1 className="text-2xl font-bold text-accent mb-2">Cargar Saldo</h1>
            <p className="text-accent/60 mb-6">
              Ingresá el monto que deseas cargar a tu billetera
            </p>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-accent mb-2">
                Monto (ARS)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-accent/30 rounded-xl focus:border-accent focus:outline-none text-accent font-semibold text-lg"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleAddBalance}
                disabled={loading}
                className="flex-1 py-3 px-4 bg-accent text-white rounded-full hover:bg-hovercolor transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? "Procesando..." : "Cargar"}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setError("");
                  setAmount("");
                }}
                className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
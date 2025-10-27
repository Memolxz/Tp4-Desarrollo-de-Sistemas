import { useState } from "react";
import { Phone, Instagram, Facebook, Mail } from "lucide-react";

export default function Footer() {
    const [active, setActive] = useState<string | null>(null);

    const toggle = (icon: string) => {
        setActive(active === icon ? null : icon);
    };

    const contacts = [
        { id: "phone", icon: Phone, text: "+54 9 11 1234-5678" },
        { id: "mail", icon: Mail, text: "contacto@migueventos.com" },
        { id: "instagram", icon: Instagram, text: "@migueventos" },
        { id: "facebook", icon: Facebook, text: "MiguEventos Oficial" },
    ];

    return (
        <footer className="relative flex justify-between font-geist items-center w-full bg-white h-[140px] border-t border-gray-300 px-6">
        
        <div className="text-accent font-bold font-inter text-2xl pl-10 mb-8">
            MiguEventos
        </div>

        <div className="flex gap-6 pr-6 mb-8">
            {contacts.map(({ id, icon: Icon, text }) => (
            <div
                key={id}
                className={`flex items-center transition-all duration-300 ${
                active === id ? "pr-1" : ""
                }`}
            >
                <div
                onClick={() => toggle(id)}
                className="border-accent rounded-full border-2 flex items-center justify-center w-8 h-8 cursor-pointer transition-transform duration-300"
                >
                <Icon className="w-5 h-5 text-accent" />
                </div>

                {active === id && (
                <span className="ml-3 text-accent text-sm whitespace-nowrap">
                    {text}
                </span>
                )}
            </div>
            ))}
        </div>

        <div className="absolute bottom-6 left-0 right-0 px-6">
            <hr className="border-t border-accent -mb-2" />
            <div className="text-center text-accent text-xs select-none mt-8">
            &copy; 2025 MiguEventos. Todos los derechos reservados.
            </div>
        </div>
        </footer>
    );
}

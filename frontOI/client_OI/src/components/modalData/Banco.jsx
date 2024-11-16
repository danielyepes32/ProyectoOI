export default function Banco({ nBanco = "Bank001", capacidad = "10", marca = "Honeywell", modelo = "M19", cert = "Conforme" }) {
    return (
        <div className="w-full h-full grid grid-cols-2 mb-10">
            <div className="w-full h-full space-y-5 flex flex-col justify-start items-left">
                <p className="h-1/3 font-semibold">No. Banco</p>
                <p className="h-1/3 font-semibold">Capacidad de medidores</p>
                <p className="h-1/3 font-semibold">Modelo</p>
                <p className="h-1/3 font-semibold">Marca</p>
                <p className="h-1/3 font-semibold">Certificados vigentes</p>
            </div>
            <div className="w-full h-full space-y-2 flex flex-col justify-end">
                <p className="text-right h-1/3">{nBanco}</p>
                <p className="text-right h-1/3">{capacidad}</p>
                <p className="text-right h-1/3">{marca}</p>
                <p className="text-right h-1/3">{modelo}</p>
                <p className="text-right h-1/3">{cert}</p>
            </div>
        </div>
    );
}
